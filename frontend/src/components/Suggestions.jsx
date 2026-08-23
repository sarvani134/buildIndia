import React from 'react';
export const QUICK=['Check PF Balance','Renew Driving Licence','Book Train','Check Pension','Update Aadhaar','File Grievance'];
export default function Suggestions({onSelect}){return <div className="suggestions" aria-label="Popular searches">{QUICK.map(item=><button key={item} onClick={()=>onSelect(item)}>{item}</button>)}</div>}
