import express from 'express';
import { slideCtrl } from '../controllers/index.js';
import { validateToken } from '../middlewares/index.js';

const {
  getAllSlides,
  createSlide,
  updateAllOrdersCreateOne,
  updateSlide,
  updateAllSlides,
  deleteSlide,
  updateAllOrdersDeleteOne,
} = slideCtrl;

const router = express.Router();

const slideRoutes = {
  GET_ALL: '/slides',
  CREATE: '/slides/create',
  UPDATE_ALL_ORDERS_CREATE: '/slides/reorder-create',
  UPDATE: '/slides/update/:id',
  UPDATE_ALL: '/slides/update-all/:id',
  DELETE: '/slides/delete/:id',
  UPDATE_ALL_ORDERS_DELETE: '/slides/reorder-delete/:id',
};

router.get(slideRoutes.GET_ALL, getAllSlides);
router.post(slideRoutes.CREATE, validateToken, createSlide);
router.post(
  slideRoutes.UPDATE_ALL_ORDERS_CREATE,
  validateToken,
  updateAllOrdersCreateOne
);
router.put(slideRoutes.UPDATE, validateToken, updateSlide);
router.put(slideRoutes.UPDATE_ALL, validateToken, updateAllSlides);
router.delete(slideRoutes.DELETE, validateToken, deleteSlide);
router.delete(
  slideRoutes.UPDATE_ALL_ORDERS_DELETE,
  validateToken,
  updateAllOrdersDeleteOne
);

export default router;
