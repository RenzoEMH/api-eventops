import express from 'express';
import { eventCtrl } from '../controllers/index.js';

const { getAllEvents, createEvent, updateEvent } = eventCtrl;

const router = express.Router();

const eventRoutes = {
  GET_ALL: '/events',
  CREATE: '/events/create',
  UPDATE: '/events/update/:id',
};

router.get(eventRoutes.GET_ALL, getAllEvents);
router.post(eventRoutes.CREATE, createEvent);
router.put(eventRoutes.UPDATE, updateEvent);

export default router;
