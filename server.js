import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';

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

// rutas

app.get('/', (req, res) => {
  res.send('API EVENTOPS');
});

// configurar el puerto donde se escuchara
const PORT = process.env.PORT || 5000;

// lanzar servidor
app.listen(PORT, () => {
  console.log('- Initialized server -');
});
