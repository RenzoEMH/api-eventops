import mongoose from 'mongoose';

const { Schema } = mongoose;

const ticketCategoriesSchema = new Schema(
  {
    type: String,
    price: Number,
    quantity: Number,
    sold: Number,
  },
  {
    timestamps: true,
  }
);

const datesSchema = new Schema(
  {
    date: String,
    startHour: String,
    endHour: String,
    isEditable: Boolean,
    ticketCategories: [ticketCategoriesSchema],
  },
  {
    timestamps: true,
  }
);

const eventsSchema = new Schema(
  {
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
    idOwner: mongoose.SchemaTypes.ObjectId,
    ownerName: String,
    state: String,
    dates: [datesSchema],
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model('Events', eventsSchema, 'events');

export default Event;
