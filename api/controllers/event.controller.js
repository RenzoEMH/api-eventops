import { Event } from '../models/index.js';

// Controller get all events
export const getAllEvents = async (request, response) => {
  try {
    const events = await Event.find();
    if (events.length === 0) response.status(204).send();
    else response.status(200).json(events);
  } catch (error) {
    response.status(500).json({ error });
  }
};

// Controller create an event
export const createEvent = async (request, response) => {
  try {
    const event = new Event(request.body);
    const newEvent = await event.save();
    newEvent && response.status(201).json(newEvent);
  } catch (error) {
    response.status(500).json({ error });
  }
};
