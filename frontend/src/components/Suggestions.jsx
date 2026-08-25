import React from 'react';
import { ArrowRight } from 'lucide-react';
import { getQuickActions } from '../i18n.js';

export const QUICK = [
  'Check PF Balance',
  'Renew Driving Licence',
  'Book Train',
  'Check Pension',
  'Update Aadhaar',
  'File Grievance'
];

export default function Suggestions({ onSelect, locale = 'en' }) {
  return (
    <>
      <p className="language-hint">
        <span>अ · అ · ಅ · അ · அ · অ</span>
        {' '}Understands Indian languages and mixed-language requests
      </p>

      <div className="suggestions" aria-label="Popular searches">
        {getQuickActions(locale).map((item) => (
          <button
            key={item.query}
            onClick={() => onSelect(item.query)}
          >
            <span>{item.label}</span>
            <ArrowRight aria-hidden="true" />
          </button>
        ))}
      </div>
    </>
  );
}