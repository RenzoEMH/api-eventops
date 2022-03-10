import express from 'express';
import { userCtrl } from '../controllers/index.js';

const { getAllUsers, createUser } = userCtrl;

const router = express.Router();

const userRoutes = {
  GET_ALL: '/users',
  CREATE: '/users/create',
};

router.get(userRoutes.GET_ALL, getAllUsers);
router.post(userRoutes.CREATE, createUser);

export default router;