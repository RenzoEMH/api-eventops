import express from 'express';
import { slideCtrl } from '../controllers/index.js';
import { validateToken } from '../middlewares/index.js';

const { getAllSlides, createSlide, updateSlide, deleteSlide } = slideCtrl;

const router = express.Router();

const slideRoutes = {
  GET_ALL: '/slides',
  CREATE: '/slides/create',
  UPDATE: '/slides/update/:id',
  DELETE: '/slides/delete/:id',
};

router.get(slideRoutes.GET_ALL, getAllSlides);
router.post(slideRoutes.CREATE, validateToken, createSlide);
router.put(slideRoutes.UPDATE, validateToken, updateSlide);
router.delete(slideRoutes.DELETE, validateToken, deleteSlide);

export default router;
