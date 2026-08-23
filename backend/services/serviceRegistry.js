import mongoose from 'mongoose';
import Service from '../models/Service.js';
import { services } from '../data/services.js';

export async function allServices() {
  if (mongoose.connection.readyState === 1) {
    const records = await Service.find().lean();
    if (records.length) return records;
  }
  return services;
}

