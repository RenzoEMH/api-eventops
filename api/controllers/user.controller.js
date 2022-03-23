import { User } from '../models/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import senderMail from '../services/sendEmail.js';
import Token from '../models/token.model.js';
import crypto from 'crypto';
import { EmailConfirmation } from '../utils/emailConfirmation.js';
import { setPassword } from '../utils/setPassword.js';

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.find({ email });
  const userDB = user[0];
  if (user.length === 0)
    return res.status(403).send({ message: 'Correo invalido' });
  if (userDB.verified === false)
    return res.status(403).send({
      message: 'Usuario no verificado, revise su correo para activar su cuenta',
    });
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
      res.status(403).send({ message: 'Contraseña invalida' });
    }
  });
};

// Controller get all users
export const getAllUsers = async (request, response) => {
  try {
    const users = await User.find();
    if (users.length === 0) response.status(204).send();
    else response.status(200).json(users);
  } catch (error) {
    response.status(500).json({ error });
  }
};

// Controller create an user
export const createUser = async (request, response) => {
  const { password } = request.body;
  const hash = await bcrypt.hash(password, 10);
  const newUser = new User({ ...request.body, password: hash });
  let user = await User.findOne({ email: request.body.email });
  try {
    user = await newUser.save();
    const token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString('hex'),
    }).save();
    const url = `${process.env.BASE_URL}${user.id}/verify/${token.token}`;
    const html = EmailConfirmation(url);
    await senderMail(user.email, 'Verificación de cuenta - EVENTOPS', html);
    console.log(url);
    newUser && response.status(201).json(newUser);
  } catch (error) {
    response.status(500).json({ error });
  }
};

//Controller update an user
export const updateUser = async (request, response) => {
  const { id: idUser } = request.params;
  const userToUpdate = request.body;

  const user = await User.findById(idUser);

  try {
    User.updateOne(user, userToUpdate, (error, updatedUser) => {
      if (!error) {
        response.status(200).json(updatedUser);
      } else response.status(500).send(error);
    });
  } catch (error) {
    response.status(500).send(error);
  }
};

//Controller verify email
export const verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({ message: 'Invalid link' });
    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (token === null) {
      return res.status(400).send({ message: 'Invalid link' });
    }
    await User.updateOne({ _id: user._id }, { verified: true });
    await token.remove();
    res.status(200).send({ message: 'Email verified successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

// Controller generate link for password recovery
export const linkResetPassword = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(409)
        .send({ message: 'User with given email does not exist!' });
    }
    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString('hex'),
      }).save();
    }

    const url = `${process.env.BASE_URL}password-reset/${user._id}/${token.token}`;
    const html = setPassword(url);
    await senderMail(user.email, 'Recuperación de contraseña - EVENTOPS', html);

    res
      .status(200)
      .send({ message: 'Password reset link sent to your email account' });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

// Controller reset password
export const resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({ message: 'Invalid link' });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send({ message: 'Invalid link' });

    if (!user.verified) user.verified = true;

    const hashPassword = await bcrypt.hash(req.body.password, 10);

    user.password = hashPassword;
    await user.save();
    await token.remove();

    res.status(200).send({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
};
