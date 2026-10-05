import mongoose from 'mongoose';

let isMongoConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart_society';
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    isMongoConnected = true;
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[MongoDB Warning] Could not connect to MongoDB at ${uri}: ${error.message}`);
    console.log(`[MongoDB Fallback] Operating with in-memory resilient storage mode for turnkey local demo.`);
    isMongoConnected = false;
    return false;
  }
};

export const getDBStatus = () => ({
  connected: isMongoConnected,
  type: isMongoConnected ? 'MongoDB (Live Cluster)' : 'Hybrid In-Memory Store (Turnkey Demo Mode)'
});
