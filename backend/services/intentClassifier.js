import { services } from '../data/services.js';

const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
const tokens = (value) => new Set(normalize(value).split(' ').filter((word) => word.length > 1));

function scoreKeyword(query, keyword) {
  const cleanQuery = normalize(query);
  const cleanKeyword = normalize(keyword);
  if (cleanQuery.includes(cleanKeyword)) return 1 + Math.min(cleanKeyword.split(' ').length * .12, .45);
  const queryTokens = tokens(cleanQuery);
  const keywordTokens = [...tokens(cleanKeyword)];
  return keywordTokens.filter((word) => queryTokens.has(word)).length / keywordTokens.length;
}

export function classifyIntent(query) {
  const ranked = services.map((service) => ({
    intent: service.intent,
    confidence: Math.max(...service.keywords.map((keyword) => scoreKeyword(query, keyword)), 0)
  })).sort((a,b) => b.confidence - a.confidence);
  const best = ranked[0];
  return { intent: best.confidence >= .58 ? best.intent : null, confidence: Math.min(best.confidence / 1.35, .99), alternatives: ranked.slice(0,3) };
}

// Provider seam: add an adapter that returns { intent, confidence }; never accept provider metadata or URLs.
export async function classifyWithConfiguredProvider(query) {
  return classifyIntent(query);
}

