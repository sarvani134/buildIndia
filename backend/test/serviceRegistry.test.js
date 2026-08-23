import test from 'node:test';
import assert from 'node:assert/strict';
import { services } from '../data/services.js';
import { isTrustedOfficialUrl } from '../services/urlValidator.js';

test('catalogue contains at least 100 services with unique intents', () => {
  assert.ok(services.length >= 100);
  assert.equal(new Set(services.map((service) => service.intent)).size, services.length);
});

test('every catalogue URL passes the reviewed host allowlist', () => {
  const rejected = services.filter((service) => !isTrustedOfficialUrl(service.officialUrl));
  assert.deepEqual(rejected, []);
});
