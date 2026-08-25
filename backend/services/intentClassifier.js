import { services } from '../data/services.js';
import { expandMultilingualQuery, normalizeSearchText } from './languageNormalizer.js';

const normalize = (value) => normalizeSearchText(value).replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
const tokens = (value) => new Set(normalize(value).split(' ').filter((word) => word.length > 1));

function oneEditApart(a, b) {
  if (a === b) return true;
  if (Math.min(a.length, b.length) < 6 || Math.abs(a.length - b.length) > 1 || a[0] !== b[0]) return false;
  if (a.length === b.length) {
    const differences = [...a].map((letter, index) => letter === b[index] ? -1 : index).filter((index) => index >= 0);
    if (differences.length === 2 && differences[1] === differences[0] + 1
      && a[differences[0]] === b[differences[1]] && a[differences[1]] === b[differences[0]]) return true;
  }
  let left = 0; let right = 0; let edits = 0;
  while (left < a.length && right < b.length) {
    if (a[left] === b[right]) { left += 1; right += 1; continue; }
    edits += 1;
    if (edits > 1) return false;
    if (a.length > b.length) left += 1;
    else if (b.length > a.length) right += 1;
    else { left += 1; right += 1; }
  }
  return edits + (left < a.length || right < b.length ? 1 : 0) <= 1;
}

function scoreKeyword(query, keyword) {
  const cleanQuery = normalize(query);
  const cleanKeyword = normalize(keyword);
  if (cleanQuery.includes(cleanKeyword)) return 1 + Math.min(cleanKeyword.split(' ').length * .12, .45);
  const queryTokens = tokens(cleanQuery);
  const keywordTokens = [...tokens(cleanKeyword)];
  const matched = keywordTokens.filter((word) => [...queryTokens].some((queryWord) => oneEditApart(word, queryWord))).length;
  return matched / keywordTokens.length;
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
