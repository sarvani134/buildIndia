import { classifyWithConfiguredProvider } from '../services/intentClassifier.js';
import { allServices } from '../services/serviceRegistry.js';
import { isTrustedOfficialUrl } from '../services/urlValidator.js';

const safe = ({ _id, keywords, urlNeedsVerification, ...service }) => service;
const reply = (res, payload) => res.json(payload);

export async function search(req, res, next) {
  try {
    const query = typeof req.body.query === 'string' ? req.body.query.trim().slice(0, 300) : '';
    if (!query) return res.status(400).json({ message: 'Please describe the service you need.' });
    const registry = await allServices();
    const lower = query.toLowerCase();

    if (/pension/.test(lower) && /(not received|problem|stopped|two months|complaint|status)/.test(lower)) {
      const intents = ['check_pension','life_certificate','pension_grievance'];
      return reply(res, { type:'clarification', query, message:'What would you like to do about the pension?', options: registry.filter((s) => intents.includes(s.intent)).map((s) => ({ label:s.serviceName, query:s.keywords[0] })) });
    }
    if (/renew.+licen[cs]e|licen[cs]e.+renew/.test(lower) && !/(driving|driver)/.test(lower)) {
      return reply(res, { type:'clarification', query, message:'Which licence or permit do you want help with?', options:[{label:'Driving Licence',query:'renew driving licence'},{label:'Vehicle Permit',query:'vehicle permit services'},{label:'Trade Licence',query:'file a government grievance about trade licence'}] });
    }
    const classification = await classifyWithConfiguredProvider(query);
    if (!classification.intent || classification.confidence < .43) {
      const possible = classification.alternatives.filter((item) => item.confidence >= .3).map((item) => registry.find((s) => s.intent === item.intent)).filter(Boolean);
      return reply(res, { type:'no_result', query, message:"We couldn't confidently identify the service you need.", suggestions: possible.map((s) => safe(s)) });
    }
    const matches = registry.filter((service) => service.intent === classification.intent && isTrustedOfficialUrl(service.officialUrl));
    if (!matches.length) return reply(res, { type:'no_result', query, message:'No verified official service is available for that request yet.', suggestions:[] });
    return reply(res, { type:'result', query, confidence:classification.confidence, results:matches.map(safe) });
  } catch (error) { next(error); }
}

export async function listServices(req, res, next) {
  try {
    const registry = await allServices();
    const category = String(req.query.category || '').toLowerCase();
    const selected = category ? registry.filter((s) => s.category.toLowerCase() === category) : registry;
    res.json({ results:selected.filter((s) => isTrustedOfficialUrl(s.officialUrl)).map(safe) });
  } catch (error) { next(error); }
}

