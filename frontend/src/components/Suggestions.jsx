import React from 'react';
import { BadgeIndianRupee, FileText, Fingerprint, IdCard, TrainFront, UsersRound } from 'lucide-react';

export const QUICK = ['Check PF Balance', 'Renew Driving Licence', 'Book Train', 'Check Pension', 'Update Aadhaar', 'File Grievance'];
const ICONS = [BadgeIndianRupee, IdCard, TrainFront, UsersRound, Fingerprint, FileText];

export default function Suggestions({ onSelect }) {
  return <>
    <p className="language-hint">
      Type in <button type="button">English</button><span>।</span><button type="button">हिंदी</button><span>।</span><button type="button">తెలుగు</button><span>।</span><button type="button">Hinglish</button>
    </p>
    <div className="suggestions" aria-label="Popular searches">
      {QUICK.map((item, index) => {
        const Icon = ICONS[index];
        return <button key={item} onClick={() => onSelect(item)}><Icon aria-hidden="true" /><span>{item}</span></button>;
      })}
    </div>
  </>;
}
