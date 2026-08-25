import test from 'node:test';
import assert from 'node:assert/strict';
import { search } from '../controllers/searchController.js';

async function runSearch(query) {
  let payload;
  const req = { body: { query } };
  const res = {
    statusCode: 200,
    status(code) { this.statusCode = code; return this; },
    json(value) { payload = value; return value; }
  };
  await search(req, res, (error) => { throw error; });
  return { statusCode: res.statusCode, payload };
}

test('Aadhaar document search combines the UIDAI service with Digital Aadhaar', async () => {
  const { statusCode, payload } = await runSearch('show my Aadhaar document');
  assert.equal(statusCode, 200);
  assert.equal(payload.type, 'result');
  assert.equal(payload.subtype, 'service_with_digilocker_documents');
  assert.ok(payload.results.some((result) => result.portalName === 'UIDAI'));
  assert.ok(payload.results.some((result) => result.intent === 'digilocker_digital_aadhaar'));
});

test('driving licence document search includes its service and exact DigiLocker match only', async () => {
  const { payload } = await runSearch('get my driving licence document');
  const digiLockerResults = payload.results.filter((result) => result.documentMatch);
  assert.equal(payload.subtype, 'service_with_digilocker_documents');
  assert.deepEqual(digiLockerResults.map((result) => result.intent), ['digilocker_driving_licence']);
});
