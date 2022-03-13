import mongoose from 'mongoose';

const { Schema } = mongoose;

const usersSchema = new Schema(
  {
    name: String,
    lastname: String,
    email: String,
    password: String,
    photo: String,
    dni: String,
    type: String,
    estado: Boolean,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('Users', usersSchema, 'users');

export default User;
