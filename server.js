import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import cors from 'cors';
import sgMail from '@sendgrid/mail';

import {
  eventRouter,
  userRouter,
  slideRouter,
  saleRouter,
  ticketRouter,
} from './api/routes/index.js';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
/**
 * Mongoose
 */

// Connect to db
const dbConnection = process.env.DB_STRING_CONNECTION;
mongoose.connect(dbConnection);

// Listener to connection error
mongoose.connection.on('error', (e) => {
  console.error('ERROR: ', e);
});

/**
 * Express
 */
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// rutas

app.get('/', (req, res) => {
  res.send('API EVENTOPS');
});

app.use('/api', eventRouter);
app.use('/api', userRouter);
app.use('/api', slideRouter);
app.use('/api', saleRouter);
app.use('/api', ticketRouter);

// configurar el puerto donde se escuchara
const PORT = process.env.PORT;

// lanzar servidor
app.listen(PORT, () => {
  console.log('- Initialized server -');
});
