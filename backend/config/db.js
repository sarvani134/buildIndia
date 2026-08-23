import mongoose from 'mongoose';

export async function connectDB(uri) {
  if (!uri) return false;
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    console.log('MongoDB connected');
    return true;
  } catch (error) {
    console.warn(`MongoDB unavailable; using the trusted in-memory registry (${error.message})`);
    return false;
  }
}

