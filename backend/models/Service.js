import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  intent: { type: String, required: true, unique: true, index: true },
  portalName: { type: String, required: true },
  serviceName: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true, index: true },
  buttonText: { type: String, required: true },
  officialUrl: { type: String, required: true },
  keywords: { type: [String], default: [] },
  logo: { type: String, default: '' },
  urlNeedsVerification: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Service', serviceSchema);

