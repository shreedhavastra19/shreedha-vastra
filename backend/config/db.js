// ================================================================
// Shreedha Vastra — Database Connection (MongoDB via Mongoose)
// ================================================================
// Establishes a single connection to MongoDB when the server
// starts. If the connection fails, the process exits immediately
// rather than letting the app run in a broken state.
// ================================================================

import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error(
        'MONGO_URI is not defined. Did you create a .env file from .env.example?'
      );
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB connected: ${conn.connection.host}`);

    // Log if the connection drops after the initial successful connect
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err.message}`);
    });
  } catch (error) {
    console.error(`Failed to connect to MongoDB: ${error.message}`);
    // Exit the process — there's no point running an API with no database
    process.exit(1);
  }
};

export default connectDB;
