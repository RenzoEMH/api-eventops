import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import cors from 'cors';

import { eventRouter, userRouter } from './api/routes/index.js';

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

// configurar el puerto donde se escuchara
const PORT = process.env.PORT || 5000;

// lanzar servidor
app.listen(PORT, () => {
  console.log('- Initialized server -');
});
