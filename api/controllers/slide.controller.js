import { Slide } from '../models/index.js';

// Controller get all events
export const getAllSlides = async (request, response) => {
  try {
    const slides = await Slide.find();
    if (slides.length === 0) response.status(204).send();
    else response.status(200).json(slides);
  } catch (error) {
    response.status(500).json({ error });
  }
};

// Controller create an event
export const createSlide = async () => {
  console.log('nex');
};
