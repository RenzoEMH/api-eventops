import express from 'express';
import { userCtrl } from '../controllers/index.js';

const { login, getAllUsers, createUser } = userCtrl;

const router = express.Router();

const userRoutes = {
  LOGIN: '/login',
  GET_ALL: '/users',
  CREATE: '/users/create',
};

router.post(userRoutes.LOGIN, login);
router.get(userRoutes.GET_ALL, getAllUsers);
router.post(userRoutes.CREATE, createUser);

export default router;