import mongoose from 'mongoose';
import axios from 'axios';
import crypto from 'crypto';
import { Event, User, Sale, Ticket } from '../models/index.js';

// Controller create sale and ticket(s)
export const createSaleTicket = async (request, response) => {
  const { id, cart, userId } = request.body;
  const url = `${process.env.EPAYCO_API_SERVER}${id}`;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const axiosResponse = await axios.get(url);
    if (!axiosResponse.data.success)
      throw new Error('Codigo de transaccion no valido');

    const refPayco = axiosResponse.data.data.x_ref_payco;
    const transactionId = axiosResponse.data.data.x_transaction_id;
    const amount = axiosResponse.data.data.x_amount;
    const currency = axiosResponse.data.data.x_currency_code;
    const signature = axiosResponse.data.data.x_signature;
    const str = `${process.env.P_CUST_ID_CLIENTE}^${process.env.P_KEY}^${refPayco}^${transactionId}^${amount}^${currency}`;
    const hash = crypto.createHash('sha256').update(str).digest('hex');

    if (signature != hash) throw new Error('Codigo de transaccion no valido');

    const saleExist = await Sale.findOne({ token: signature });
    if (saleExist) throw new Error('La venta ya fue registrada');

    const codeResponse = axiosResponse.data.data.x_cod_response;

    switch (codeResponse) {
      case 1:
        const cartAmounts = await Promise.all(
          cart.map(async (item) => {
            const eventFound = await Event.findById(item.idEvento);
            if (!eventFound) return 0;
            const dateFound = eventFound.dates.find(
              (dateItem) => dateItem._id.toString() === item.dateId
            );
            if (!dateFound) return 0;
            const categoryFound = dateFound.ticketCategories.find(
              (category) => category._id.toString() === item.categoryId
            );
            if (!categoryFound) return 0;
            return categoryFound.price * item.amount;
          })
        );
        const cartTotal = cartAmounts.reduce((acc, curr) => acc + curr, 0);
        if (cartTotal !== amount) throw new Error('Error de monto');
        const userFound = await User.findById(userId);

        if (!userFound) throw new Error('No user found');

        // create Sale
        const newSale = {
          token: signature,
          numberTransaction: transactionId,
          client: userFound.name,
          cardNumber: axiosResponse.data.data.x_cardnumber,
          paymentDate: axiosResponse.data.data.x_transaction_date,
          cardType: axiosResponse.data.data.x_franchise,
          idUser: userFound._id,
          totalFare: amount,
        };
        const sale = new Sale(newSale);
        const newSavedSale = await sale.save();
        if (!newSavedSale) throw new Error('MongoDB error');

        for (const item of cart) {
          let newTicket = {
            idSale: newSavedSale._id,
            idUsuario: userFound._id,
            idEvento: item.idEvento,
            idDate: item.dateId,
            idCategory: item.categoryId,
            quantity: item.amount,
          };

          let ticket = new Ticket(newTicket);
          let savedTicket = await ticket.save();
          if (!savedTicket) throw new Error('MongoDB error');
        }
        // save transaction
        response.status(200).json(newSavedSale);
        await session.commitTransaction();
        break;

      default:
        response.status(400).send({ message: 'transacción incorrecta' });
        break;
    }
  } catch (error) {
    await session.abortTransaction();
    response.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};
