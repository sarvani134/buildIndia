import 'dotenv/config';
import { connectDB } from '../config/db.js';
import Service from '../models/Service.js';
import { services } from './services.js';
if (!await connectDB(process.env.MONGODB_URI)) process.exit(1);
await Service.bulkWrite(services.map((service) => ({ updateOne:{ filter:{intent:service.intent}, update:{$set:service}, upsert:true } })));
console.log(`Seeded ${services.length} trusted services.`);
process.exit(0);

