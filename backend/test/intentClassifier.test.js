import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyIntent } from '../services/intentClassifier.js';
test('recognises natural PF language', () => assert.equal(classifyIntent('my company cuts PF every month, where can I see it').intent, 'check_pf_balance'));
test('distinguishes cyber fraud', () => assert.equal(classifyIntent('complain about an online payment scam').intent, 'report_cybercrime'));
test('does not guess nonsense', () => assert.equal(classifyIntent('purple elephants dancing').intent, null));
test('understands common Hinglish', () => assert.equal(classifyIntent('mujhe PF ka paisa dekhna hai').intent, 'check_pf_balance'));
test('understands Roman Telugu', () => assert.equal(classifyIntent('naaku pf dabbu chudali').intent, 'check_pf_balance'));
test('understands Roman Kannada', () => assert.equal(classifyIntent('nanage driving license renew madbeku').intent, 'renew_driving_license'));
test('understands Roman Marathi', () => assert.equal(classifyIntent('mala nokri pahije').intent, 'job_search'));
test('understands Roman Malayalam', () => assert.equal(classifyIntent('enikku online doctor venam').intent, 'telemedicine'));
test('understands Roman Tamil', () => assert.equal(classifyIntent('enakku rayil ticket venum').intent, 'book_train'));
test('understands Roman Bengali', () => assert.equal(classifyIntent('amar scholarship status dekhte chai').intent, 'scholarship_status'));
test('understands Roman Gujarati', () => assert.equal(classifyIntent('mane kisan credit card joie').intent, 'kisan_credit'));
test('understands Roman Punjabi', () => assert.equal(classifyIntent('mainu bijli bill bharna hai').intent, 'electricity_services'));
test('understands train booking as book train', () => assert.equal(classifyIntent('train booking').intent, 'book_train'));
test('understands railway reservation phrasing', () => assert.equal(classifyIntent('I need a railway reservation').intent, 'book_train'));
test('understands common passport spelling mistakes', () => assert.equal(classifyIntent('pasport application').intent, 'apply_passport'));
test('understands action word variants for PAN', () => assert.equal(classifyIntent('PAN card application').intent, 'apply_pan'));
test('understands voter registration phrasing', () => assert.equal(classifyIntent('voter registration').intent, 'voter_registration'));
test('understands plural job vacancy searches', () => assert.equal(classifyIntent('show government job vacancies').intent, 'job_search'));
test('understands gas cylinder booking', () => assert.equal(classifyIntent('gas cylinder booking').intent, 'lpg_subsidy'));
test('understands hospital booking', () => assert.equal(classifyIntent('government hospital booking').intent, 'doctor_appointment'));
test('tolerates a small service-name typo', () => assert.equal(classifyIntent('check my pensoin status').intent, 'check_pension'));

test('maps varied train-booking language to one intent', () => {
  const queries = [
    'train booking', 'book train', 'book a train', 'railway booking', 'rail ticket',
    'book railway ticket', 'train reservation', 'reserve train', 'irctc booking',
    'trin booking', 'train bokking', 'book tran', 'I want to book a train', 'I need railway tickets'
  ];
  for (const query of queries) assert.equal(classifyIntent(query).intent, 'book_train', query);
});

test('maps varied driving-licence renewal language to one intent', () => {
  const queries = [
    'renew driving licence', 'driving license renewal', 'renew licence', 'DL renewal',
    'my licence expired', 'renew my DL', 'licence renew karna hai',
    'drving licence renew', 'renew driving lisence'
  ];
  for (const query of queries) assert.equal(classifyIntent(query).intent, 'renew_driving_license', query);
});

test('handles the imperfect demo queries through the staged intent pipeline', () => {
  for (const query of ['booking train', 'reserve railway ticket', 'pls I want to bok a railway tiket', 'bok train tiket']) {
    assert.equal(classifyIntent(query).intent, 'book_train', query);
  }
  assert.equal(classifyIntent('pension status kaise check kare').intent, 'check_pension');
  assert.equal(classifyIntent('pension dabbu vachinda').intent, 'check_pension');
});

test('expands common Indian government-service abbreviations', () => {
  assert.equal(classifyIntent('check employee provident fund balance').intent, 'check_pf_balance');
  assert.equal(classifyIntent('EPF balance').intent, 'check_pf_balance');
  assert.equal(classifyIntent('RTO services').intent, 'vehicle_services');
});
