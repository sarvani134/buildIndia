import React from 'react';
import { HelpCircle } from 'lucide-react';
import { t } from '../i18n.js';
export default function ClarificationCard({message,options,onSelect,locale='en'}){return <section className="clarification"><div className="question-icon"><HelpCircle/></div><h2>{message}</h2><p>{t(locale,'choose')}</p><div className="option-list">{options.map(o=><button key={o.label} onClick={()=>onSelect(o.query)}>{o.label}</button>)}</div></section>}
