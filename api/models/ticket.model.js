import mongoose from 'mongoose';

const { Schema, SchemaTypes } = mongoose;

const ticketSchema = new Schema(
  {
    idSale: SchemaTypes.ObjectId,
    idUsuario: SchemaTypes.ObjectId,
    idEvento: SchemaTypes.ObjectId,
    idDate: SchemaTypes.ObjectId,
    idCategory: SchemaTypes.ObjectId,
    quantity: Number,
  },
  {
    timestamps: true,
  }
);

const Ticket = mongoose.model('Tickets', ticketSchema, 'tickets');

export default Ticket;
