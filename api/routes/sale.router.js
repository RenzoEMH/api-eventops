import express from 'express';
import { salesCtrl } from '../controllers/index.js';
import { validateToken } from '../middlewares/index.js';

const { createSaleTicket } = salesCtrl;

const router = express.Router();

const saleRoutes = {
  CREATE: '/sales/create',
};

router.post(saleRoutes.CREATE, validateToken, createSaleTicket);

export default router;
