import { classifyWithConfiguredProvider } from './intentClassifier.js';
import { expandMultilingualQuery } from './languageNormalizer.js';

const byIntent = (registry, intent) => registry.find((service) => service.intent === intent);
const option = (label, query) => ({ label, query });

const ADDRESS_OPTIONS = [
  option('Aadhaar', 'update aadhaar address'),
  option('Voter ID', 'update voter address'),
  option('Driving Licence', 'update driving licence address'),
  option('Ration Card', 'update ration card address')
];

const TRANSFER_OPTIONS = [
  option('Employee / Job', 'transfer pf account'),
  option('Education', 'transfer certificate services'),
  option('Vehicle', 'vehicle ownership transfer'),
  option('Other', 'government transfer services')
];

const direct = (query, service, confidence = .99) => ({ type: 'result', query, confidence, results: service ? [service] : [] });
const clarification = (query, message, options) => ({ type: 'clarification', query, message, options });

// Extract the target entity before generic scoring so an explicit document wins.
function resolveKnownRequest(query, registry) {
  const lower = expandMultilingualQuery(query);
  if (/\b(help|help me|assist me)\b/.test(lower)) return { type: 'low' };
  if (/\b(transferred|transfer)\b/.test(lower) && !/(pf|epf|vehicle|certificate)/.test(lower)) return clarification(query, 'What kind of transfer do you mean?', TRANSFER_OPTIONS);
  const mentionsAadhaar = /\baadhaar\b/.test(lower);
  const forgotAadhaarNumber = mentionsAadhaar && /\b(number|no)\b/.test(lower) && /(forgot|find|know|get)/.test(lower);
  const needsAadhaarAgain = mentionsAadhaar && (/(lost|replace|replacement|reprint|retrieve|recovery)/.test(lower) || /\b(get|need)\b.*\bagain\b/.test(lower));
  if (forgotAadhaarNumber) return direct(query, byIntent(registry, 'aadhaar_services'));
  if (needsAadhaarAgain) return direct(query, byIntent(registry, 'reprint_aadhaar'));
  if (/(renew|renewal).*(driving|driver).*(licen[cs]e)|(driving|driver).*(licen[cs]e).*(renew|renewal)/.test(lower)) return direct(query, byIntent(registry, 'renew_driving_license'));
  if (/\b(caste|sc|st|obc)\b.*\bcertificate\b|\bcertificate\b.*\b(caste|sc|st|obc)\b/.test(lower)) return direct(query, byIntent(registry, 'caste_certificate'));
  if (/\b(scholarship|education grant)\b/.test(lower) && /(apply|need|find|want)/.test(lower)) return direct(query, byIntent(registry, 'scholarship_search'));
  if (/\bpension\b/.test(lower) && /(check|status|payment|my pension)/.test(lower) && !/(not received|problem|stopped|complaint)/.test(lower)) return direct(query, byIntent(registry, 'check_pension'));
  if (/\b(address|address change|address update)\b/.test(lower)) {
    if (/\b(aadhaar|uidai)\b/.test(lower)) return direct(query, byIntent(registry, 'update_aadhaar_address'));
    if (/\b(voter|electoral)\b/.test(lower)) return direct(query, byIntent(registry, 'voter_correction'));
    if (/\b(driving|driver|licen[cs]e)\b/.test(lower)) return direct(query, byIntent(registry, 'update_driving_licence_address'));
    if (/\b(ration|food card)\b/.test(lower)) return direct(query, byIntent(registry, 'update_ration_card_address'));
    return clarification(query, 'Which service do you mean?', ADDRESS_OPTIONS);
  }
  return null;
}

export async function matchServiceRequest(query, registry) {
  const known = resolveKnownRequest(query, registry);
  if (known?.type === 'low') return { type: 'no_result', query, message: 'Tell us a little more about what you need.', suggestions: [] };
  if (known) return known.type === 'result' && !known.results.length ? { type: 'no_result', query, message: 'No verified official service is available for that request yet.', suggestions: [] } : known;
  const classification = await classifyWithConfiguredProvider(query);
  if (!classification.intent || classification.confidence < .43) return { type: 'no_result', query, message: 'Tell us a little more about what you need.', suggestions: [] };
  const service = byIntent(registry, classification.intent);
  return service ? direct(query, service, classification.confidence) : { type: 'no_result', query, message: 'No verified official service is available for that request yet.', suggestions: [] };
}
