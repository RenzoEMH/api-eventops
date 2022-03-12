import { User } from '../models/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.find({ email });
  const userDB = user[0];

  if (user.length === 0) res.status(403).send();

  // Validate hash
  bcrypt.compare(password, userDB.password, (err, isPassValid) => {
    if (email === userDB.email && isPassValid) {
      jwt.sign(
        { email: userDB.email, id: userDB._id, type: userDB.type },
        process.env.SECRET_KEY,
        (error, token) => {
          if (!error) {
            res.status(200).json({
              token,
            });
          } else {
            res.status(403).send();
          }
        }
      );
    } else {
      res.status(403).send();
    }
  });
};

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
