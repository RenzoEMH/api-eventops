import express from 'express';
import { ticketsCtrl } from '../controllers/index.js';
import { validateToken } from '../middlewares/index.js';

const { getAllTicket} = ticketsCtrl;

const router = express.Router();

const ticketRoutes = {
    GET_ALL: '/tickets',
}

router.get(ticketRoutes.GET_ALL, validateToken, getAllTicket);

export default router;