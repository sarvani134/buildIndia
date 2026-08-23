import { describe, expect, it } from 'vitest';
import { QUICK } from './Suggestions.jsx';

describe('quick search suggestions', () => {
  it('contains the six core discovery journeys', () => {
    expect(QUICK).toEqual([
      'Check PF Balance',
      'Renew Driving Licence',
      'Book Train',
      'Check Pension',
      'Update Aadhaar',
      'File Grievance'
    ]);
  });
});
