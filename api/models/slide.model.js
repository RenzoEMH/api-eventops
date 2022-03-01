import mongoose from 'mongoose';

const { Schema } = mongoose;

const slideSchema = new Schema({
  title: String,
  date: String,
  order: Number,
  img: String,
  eventId: mongoose.SchemaTypes.ObjectId,
  createdAt: { type: Date, immutable: true, default: () => Date.now() },
  updatedAt: { type: Date, default: () => Date.now() },
});

const Slide = mongoose.model('Slides', slideSchema, 'slides');

export default Slide;
