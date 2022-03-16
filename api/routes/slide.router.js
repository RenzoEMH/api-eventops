import express from 'express';
import { slideCtrl } from '../controllers/index.js';
import { validateToken } from '../middlewares/index.js';

const { getAllSlides, createSlide, updateSlide } = slideCtrl;

const router = express.Router();

const slideRoutes = {
  GET_ALL: '/slides',
  CREATE: '/slides/create',
  UPDATE: '/slides/update/:id',
};

router.get(slideRoutes.GET_ALL, getAllSlides);
router.post(slideRoutes.CREATE, validateToken, createSlide);
router.put(slideRoutes.UPDATE, validateToken, updateSlide);

export default router;
