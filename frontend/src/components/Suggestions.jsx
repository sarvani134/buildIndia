import React from 'react';
import { ArrowRight } from 'lucide-react';
export const QUICK=['Check PF Balance','Renew Driving Licence','Book Train','Check Pension','Update Aadhaar','File Grievance'];
export default function Suggestions({onSelect}){return <><p className="language-hint"><span>अ · అ · ಅ · അ · அ · অ</span> Understands Hinglish and Indian languages typed in English letters</p><div className="suggestions" aria-label="Popular searches">{QUICK.map(item=><button key={item} onClick={()=>onSelect(item)}><span>{item}</span><ArrowRight aria-hidden="true"/></button>)}</div></>}
