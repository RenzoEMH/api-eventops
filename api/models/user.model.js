import mongoose from 'mongoose';

const { Schema } = mongoose;

const usersSchema = new Schema({
    name: String,
    lastname: String,
    email: String,
    password: String,
    photo: String,
    dni: String,
    type: String,
    estado: Boolean,
    createdAt: { type: Date, immutable: true, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
});

const User = mongoose.model('Users', usersSchema, 'users');

export default User;