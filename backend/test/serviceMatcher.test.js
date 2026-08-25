import test from 'node:test';
import assert from 'node:assert/strict';
import { services } from '../data/services.js';
import { matchServiceRequest } from '../services/serviceMatcher.js';

async function match(query) { return matchServiceRequest(query, services); }

test('routes explicit Aadhaar address requests to one service', async () => {
  const result = await match('I want to update my Aadhaar address');
  assert.equal(result.type, 'result');
  assert.equal(result.results[0].intent, 'update_aadhaar_address');
});

test('uses a compact choice for an unspecified address change', async () => {
  const result = await match('I want to change my address');
  assert.equal(result.type, 'clarification');
  assert.deepEqual(result.options.map((item) => item.label), ['Aadhaar', 'Voter ID', 'Driving Licence', 'Ration Card']);
});

test('routes clear service requests directly', async () => {
  for (const [query, intent] of [['I want to renew my driving licence', 'renew_driving_license'], ['I need a caste certificate', 'caste_certificate'], ['I want to check my pension', 'check_pension'], ['I lost my Aadhaar', 'reprint_aadhaar'], ['I want to update my voter address', 'voter_correction']]) {
    const result = await match(query);
    assert.equal(result.type, 'result');
    assert.equal(result.results[0].intent, intent);
  }
});

test('normalizes common Aadhaar spelling variations and retrieval language', async () => {
  for (const query of ['i lost my adhaar', 'my aadhar is lost', 'I lost my Aadhaar', 'where can I get my Aadhaar again', 'I need my Aadhaar again']) {
    const result = await match(query);
    assert.equal(result.type, 'result');
    assert.equal(result.results[0].intent, 'reprint_aadhaar');
  }
  const forgottenNumber = await match('I forgot my Aadhaar number');
  assert.equal(forgottenNumber.type, 'result');
  assert.equal(forgottenNumber.results[0].intent, 'aadhaar_services');
});

test('normalizes Aadhaar and DL aliases without conflating their intents', async () => {
  for (const query of ['change my aadhar address', 'aadhar address correction']) {
    const result = await match(query);
    assert.equal(result.results[0].intent, 'update_aadhaar_address');
  }
  const renewal = await match('renew my dl');
  assert.equal(renewal.results[0].intent, 'renew_driving_license');
  const expired = await match('my driving licence expired');
  assert.equal(expired.results[0].intent, 'renew_driving_license');
});

test('uses one compact choice for a vague transfer request', async () => {
  const result = await match('I got transferred');
  assert.equal(result.type, 'clarification');
  assert.deepEqual(result.options.map((item) => item.label), ['Employee / Job', 'Education', 'Vehicle', 'Other']);
});

test('keeps help requests out of a conversational flow', async () => {
  const result = await match('help me');
  assert.equal(result.type, 'no_result');
  assert.equal(result.message, 'Tell us a little more about what you need.');
});

test('maps native-script address and pension queries to canonical services', async () => {
  for (const query of ['मुझे अपना आधार पता बदलना है', 'నా ఆధార్ చిరునామా మార్చాలి', 'என் ஆதார் முகவரியை மாற்ற வேண்டும்', 'ನನ್ನ ಆಧಾರ್ ವಿಳಾಸವನ್ನು ಬದಲಾಯಿಸಬೇಕು', 'എന്റെ ആധാർ വിലാസം മാറ്റണം', 'mera Aadhaar address change karna hai']) {
    const result = await match(query);
    assert.equal(result.type, 'result');
    assert.equal(result.results[0].intent, 'update_aadhaar_address');
  }
  for (const query of ['నాకు పెన్షన్ స్టేటస్ చెక్ చేయాలి', 'मुझे पेंशन का स्टेटस चेक करना है', 'என் ஓய்வூதிய நிலையை பார்க்க வேண்டும்']) {
    const result = await match(query);
    assert.equal(result.type, 'result');
    assert.equal(result.results[0].intent, 'check_pension');
  }
});
