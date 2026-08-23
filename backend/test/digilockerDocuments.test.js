import test from 'node:test';
import assert from 'node:assert/strict';
import { findDigiLockerDocuments } from '../data/digilockerDocuments.js';

test('AP Class 10 marksheet searches return only the exact DigiLocker document', () => {
  const results = findDigiLockerDocuments('10th marksheet ap');
  assert.equal(results.length, 1);
  assert.equal(results[0].intent, 'digilocker_ap_ssc_marks_memo');
  assert.equal(results[0].officialUrl, 'https://www.digilocker.gov.in/web/dashboard/issuers/005725/SSCER');
  assert.equal(results[0].issuerName, 'Board Of Secondary Education, Andhra Pradesh');
});

test('AP passing certificate does not leak into an AP marksheet search', () => {
  const results = findDigiLockerDocuments('AP 10th marks card');
  assert.deepEqual(results.map((result) => result.docTypeId), ['SSCER']);
});

test('generic DigiLocker searches do not invent a document match', () => {
  assert.deepEqual(findDigiLockerDocuments('open digilocker'), []);
});
