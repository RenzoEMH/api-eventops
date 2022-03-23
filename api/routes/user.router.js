import express from 'express';
import { userCtrl } from '../controllers/index.js';

const {
  login,
  getAllUsers,
  createUser,
  updateUser,
  verifyEmail,
  linkResetPassword,
  resetPassword,
} = userCtrl;

const router = express.Router();

const userRoutes = {
  LOGIN: '/login',
  GET_ALL: '/users',
  CREATE: '/users/create',
  UPDATE: '/users/update/:id',
  VERIFY_EMAIL: '/users/:id/verify/:token',
  RECOVER_PASS: '/recover_pass',
  SET_PASS: '/recover_pass/:id/:token',
};

router.post(userRoutes.LOGIN, login);
router.get(userRoutes.GET_ALL, getAllUsers);
router.post(userRoutes.CREATE, createUser);
router.put(userRoutes.UPDATE, updateUser);
router.get(userRoutes.VERIFY_EMAIL, verifyEmail);
router.post(userRoutes.RECOVER_PASS, linkResetPassword);
router.post(userRoutes.SET_PASS, resetPassword);
export default router;
