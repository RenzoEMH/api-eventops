import { Slide } from '../models/index.js';

// Controller get all slides
export const getAllSlides = async (request, response) => {
  try {
    const slides = await Slide.find();
    if (slides.length === 0) response.status(204).send();
    else response.status(200).json(slides);
  } catch (error) {
    response.status(500).json({ error });
  }
};

// Controller create an slide
export const createSlide = async (request, response) => {
  try {
    const slide = new Slide(request.body);
    const newSlide = await slide.save();
    newSlide && response.status(201).json(newSlide);
  } catch (error) {
    response.status(500).json({ error });
  }
};

// Controller update an slide
export const updateSlide = async (request, response) => {
  const { id: slideId } = request.params;
  const slideValueToUpdate = request.body;
  try {
    const slideFound = await Slide.findById(slideId);
    slideFound &&
      Slide.updateOne(
        { _id: slideFound._id },
        slideValueToUpdate,
        (error, result) => {
          !error
            ? response.status(200).json({ result })
            : response.status(500).send(error);
        }
      );
  } catch (error) {
    response.status(500).json({ error });
  }
};

// Controller delete slide
