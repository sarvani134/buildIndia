import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  intent: { type: String, required: true, unique: true, index: true },
  serviceId: { type: String, index: true },
  portalName: { type: String, required: true },
  department: { type: String },
  state: { type: String, default: 'India' },
  serviceName: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true, index: true },
  buttonText: { type: String, required: true },
  officialUrl: { type: String, required: true },
  officialSource: { type: String },
  lastVerified: { type: String },
  keywords: { type: [String], default: [] },
  logo: { type: String, default: '' },
  urlNeedsVerification: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Service', serviceSchema);

