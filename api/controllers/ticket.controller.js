import { Ticket } from "../models/index.js";

// Controller get all tickets
export const getAllTicket = async (request, response) => { 
    try {
        const tickets = await Ticket.find();
        if (tickets.length === 0) response.status(204).send();
        else response.status(200).json(tickets);
      } catch (error) {
        response.status(500).json({ error });
      }
}

