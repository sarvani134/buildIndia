import { services } from '../data/services.js';
import { expandMultilingualQuery, normalizeIntentText } from './languageNormalizer.js';

const normalize = (value) => normalizeIntentText(value).replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
const tokens = (value) => [...new Set(normalize(value).split(' ').filter((word) => word.length > 1))];

function damerauLevenshtein(left, right) {
  const rows = Array.from({ length: left.length + 1 }, (_, index) => [index]);
  rows[0] = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let i = 1; i <= left.length; i += 1) {
    for (let j = 1; j <= right.length; j += 1) {
      const cost = left[i - 1] === right[j - 1] ? 0 : 1;
      rows[i][j] = Math.min(rows[i - 1][j] + 1, rows[i][j - 1] + 1, rows[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && left[i - 1] === right[j - 2] && left[i - 2] === right[j - 1]) {
        rows[i][j] = Math.min(rows[i][j], rows[i - 2][j - 2] + cost);
      }
    }
  }
  return rows[left.length][right.length];
}

function tokenForms(word) {
  const forms = new Set([word]);
  if (word.length > 5 && word.endsWith('ing')) forms.add(word.slice(0, -3));
  if (word.length > 4 && word.endsWith('ed')) forms.add(word.slice(0, -2));
  for (const form of [...forms]) forms.add(form.replace(/([a-z])\1+/g, '$1'));
  return [...forms];
}

function tokenSimilarity(left, right) {
  if (left === right) return 1;
  if (Math.min(left.length, right.length) < 3) return 0;
  let best = 0;
  for (const a of tokenForms(left)) for (const b of tokenForms(right)) {
    best = Math.max(best, 1 - damerauLevenshtein(a, b) / Math.max(a.length, b.length));
  }
  return best;
}

function scoreKeyword(query, keyword) {
  const cleanQuery = normalize(query);
  const cleanKeyword = normalize(keyword);
  if (!cleanQuery || !cleanKeyword) return 0;
  if (cleanQuery === cleanKeyword) return 1.45;
  if (cleanQuery.includes(cleanKeyword)) return 1 + Math.min(tokens(cleanKeyword).length * .12, .45);
  const queryTokens = tokens(cleanQuery);
  const keywordTokens = tokens(cleanKeyword);
  const similarities = keywordTokens.map((word) => Math.max(...queryTokens.map((queryWord) => tokenSimilarity(word, queryWord)), 0));
  const phraseCoverage = similarities.reduce((total, score) => total + score, 0) / keywordTokens.length;
  const strongMatches = similarities.filter((score) => score >= .7).length;
  const completenessBonus = strongMatches === keywordTokens.length ? .18 : 0;
  return phraseCoverage + completenessBonus;
}

export function classifyIntent(query) {
  query = expandMultilingualQuery(query);
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
