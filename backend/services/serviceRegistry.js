import mongoose from 'mongoose';
import Service from '../models/Service.js';
import { services } from '../data/services.js';

export async function allServices() {
  if (mongoose.connection.readyState === 1) {
    const records = await Service.find().lean();
    if (records.length) {
      const storedByIntent = new Map(records.map((service) => [service.intent, service]));
      // Keep verified bundled additions available until an existing database is reseeded.
      return services.map((service) => ({ ...service, ...storedByIntent.get(service.intent) })).concat(records.filter((service) => !services.some((item) => item.intent === service.intent)));
    }
  }
  return services;
}

