import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyIntent } from '../services/intentClassifier.js';
test('recognises natural PF language', () => assert.equal(classifyIntent('my company cuts PF every month, where can I see it').intent, 'check_pf_balance'));
test('distinguishes cyber fraud', () => assert.equal(classifyIntent('complain about an online payment scam').intent, 'report_cybercrime'));
test('does not guess nonsense', () => assert.equal(classifyIntent('purple elephants dancing').intent, null));

