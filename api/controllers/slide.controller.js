import mongoose from 'mongoose';
import { Slide } from '../models/index.js';

// Controller get all slides
export const getAllSlides = async (request, response) => {
  try {
    const slides = await Slide.find().sort({ order: 'asc' });
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

// Controller update all orders and create new
export const updateAllOrdersCreateOne = async (request, response) => {
  const slideData = request.body;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const slides = await Slide.find().sort({ order: 'asc' });
    if (slides.length === 0) response.status(204);
    else {
      for (const item of slides) {
        let slideToUpdate = await Slide.findById(item._id);
        if (item.order >= slideData.order) {
          slideToUpdate.order += 1;
          let updatedSlide = await slideToUpdate.save();
          if (!updatedSlide) throw new Error('MongoDB error');
        }
      }
      const slideToSave = new Slide(slideData);
      const newSlide = await slideToSave.save();
      if (!!!newSlide) throw new Error('MongoDB error');
      else {
        response.status(200).json(newSlide);
        await session.commitTransaction();
      }
    }
  } catch (error) {
    await session.abortTransaction();
    response.status(500).json({ error: error.message });
  } finally {
    session.endSession();
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
    if (!slideFound) {
      response.status(404).send();
    }
  } catch (error) {
    response.status(500).json({ error });
  }
};

// controller update all slides order and one slide's data
export const updateAllSlides = async (request, response) => {
  const { id: slideId } = request.params;
  const slideValueToUpdate = request.body;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const prevSlide = await Slide.findById(slideId);
    const slides = await Slide.find().sort({ order: 'asc' });
    let order = 1;
    // two different cases
    // 1st case: from high order to low order
    if (prevSlide.order > slideValueToUpdate.order) {
      for (const item of slides) {
        if (
          item.order >= slideValueToUpdate.order &&
          item._id.toString() !== slideId
        ) {
          let slideToUpdate = await Slide.findById(item._id);
          slideToUpdate.order += 1;
          let updatedSlide = await slideToUpdate.save();
          if (!updatedSlide) throw new Error('MongoDB error');
        }
      }
    }
    // 2nd case: from low order to high order
    else {
      for (const item of slides) {
        if (
          item.order <= slideValueToUpdate.order &&
          item._id.toString() !== slideId
        ) {
          let slideToUpdate = await Slide.findById(item._id);
          slideToUpdate.order = order;
          let updatedSlide = await slideToUpdate.save();
          if (!updatedSlide) throw new Error('MongoDB error');
          order++;
        }
      }
    }
    // save edited slide
    const res = await Slide.updateOne({ _id: slideId }, slideValueToUpdate);
    if (res.modifiedCount === 1) {
      response.status(200).json(res);
      await session.commitTransaction();
    } else {
      throw new Error('Error updating slide');
    }
  } catch (error) {
    await session.abortTransaction();
    response.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

// Controller delete slide
export const deleteSlide = async (req, res) => {
  const { id: slideId } = req.params;

  try {
    const slideToDelete = await Slide.findById(slideId);
    if (!slideToDelete) res.status(204).json({ error: 'No slide to delete' });
    const deletedSlide = await Slide.deleteOne(slideToDelete);
    if (deletedSlide) res.status(200).json(deletedSlide);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Controller update all then delete one
export const updateAllOrdersDeleteOne = async (request, response) => {
  const { id: slideId } = request.params;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const slides = await Slide.find().sort({ order: 'asc' });
    const slideToDelete = await Slide.findById(slideId);
    let order = slideToDelete.order;

    for (const item of slides) {
      if (item.order > order && item._id.toString() !== slideId) {
        let slideToUpdate = await Slide.findById(item._id);
        slideToUpdate.order = order;
        let updatedSlide = await slideToUpdate.save();
        if (!updatedSlide) throw new Error('MongoDB error');
        order++;
      }
    }
    const res = await Slide.deleteOne(slideToDelete);
    if (!!res) {
      response.status(200).json(res);
      await session.commitTransaction();
    } else {
      throw new Error('Error deleting slide');
    }
  } catch (error) {
    await session.abortTransaction();
    response.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};
