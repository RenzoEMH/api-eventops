import express from 'express';
import { slideCtrl } from '../controllers/index.js';

const { getAllSlides } = slideCtrl;

const router = express.Router();

const slideRoutes = {
  GET_ALL: '/slides',
};

router.get(slideRoutes.GET_ALL, getAllSlides);

export default router;
