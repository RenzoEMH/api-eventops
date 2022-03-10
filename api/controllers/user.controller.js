import { User } from '../models/index.js';
import bcrypt from 'bcrypt';

// Controller get all events
export const getAllUsers = async (request, response) => {
  try {
    const users = await User.find();
    if (users.length === 0) response.status(204).send();
    else response.status(200).json(users);
  } catch (error) {
    response.status(500).json({ error });
  }
};

// Controller create an event
export const createUser = async (request, response) => {
  const { password } = request.body;
  const hash = await bcrypt.hash(password, 10);
  const newUser = new User({ ...request.body, password: hash });

  try {
    await newUser.save();
    newUser && response.status(201).json(newUser);
  } catch (error) {
    response.status(500).json({ error });
  }
};
