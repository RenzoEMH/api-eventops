import mongoose from 'mongoose';

const { Schema } = mongoose;

const ticketCategoriesSchema = new Schema({
  type: String,
  price: Number,
  quantity: Number,
  sold: Number,
  createdAt: { type: Date, immutable: true, default: () => Date.now() },
  updatedAt: { type: Date, default: () => Date.now() },
});

const datesSchema = new Schema({
  date: String,
  startHour: String,
  endHour: String,
  isEditable: Boolean,
  ticketCategories: [ticketCategoriesSchema],
  createdAt: { type: Date, immutable: true, default: () => Date.now() },
  updatedAt: { type: Date, default: () => Date.now() },
});

const eventsSchema = new Schema({
  title: String,
  img: String,
  ticketImg: String,
  lowestPrice: Number,
  category: String,
  ageRestriction: String,
  description: String,
  infoExtra: String,
  currency: String,
  city: String,
  address: String,
  refference: String,
  // idOwner: mongoose.SchemaTypes.ObjectId,
  ownerName: String,
  state: String,
  dates: [datesSchema],
  createdAt: { type: Date, immutable: true, default: () => Date.now() },
  updatedAt: { type: Date, default: () => Date.now() },
});

const Event = mongoose.model('Events', eventsSchema, 'events');

export default Event;
