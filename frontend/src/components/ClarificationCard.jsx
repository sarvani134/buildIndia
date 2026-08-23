import React from 'react';
import { HelpCircle } from 'lucide-react';
export default function ClarificationCard({message,options,onSelect}){return <section className="clarification"><div className="question-icon"><HelpCircle/></div><h2>Help us narrow it down</h2><p>{message}</p><div className="option-list">{options.map(o=><button key={o.label} onClick={()=>onSelect(o.query)}>{o.label}</button>)}</div></section>}
