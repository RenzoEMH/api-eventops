import express from 'express';
import { eventCtrl } from '../controllers/index.js';

const { getAllEvents, createEvent } = eventCtrl;

const router = express.Router();

const eventRoutes = {
  GET_ALL: '/events',
  CREATE: '/events/create',
};

router.get(eventRoutes.GET_ALL, getAllEvents);
router.post(eventRoutes.CREATE, createEvent);

export default router;
