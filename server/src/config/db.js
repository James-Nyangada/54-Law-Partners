import mongoose from 'mongoose';
import { env, isProduction } from './env.js';

mongoose.set('strictQuery', true);

/**
 * Connects to MongoDB. Mongoose buffers queries until the connection is up,
 * but we await it at boot anyway so a bad URI fails before the server starts
 * accepting traffic.
 */
export async function connectDatabase() {
  mongoose.connection.on('connected', () => {
    console.log('[db] connected');
  });

  mongoose.connection.on('error', (error) => {
    console.error('[db] connection error:', error.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[db] disconnected');
  });

  await mongoose.connect(env.mongoUri, {
    autoIndex: !isProduction, // build indexes in dev; create them deliberately in prod
    serverSelectionTimeoutMS: 10000,
  });

  return mongoose.connection;
}

export async function disconnectDatabase() {
  await mongoose.connection.close();
}
