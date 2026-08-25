import React from 'react';
import { SearchX } from 'lucide-react';
import ServiceCard from './ServiceCard.jsx';
import ClarificationCard from './ClarificationCard.jsx';
import { t } from '../i18n.js';
export default function SearchResults({response,onSearch,locale='en'}){
 if(!response)return null;
 if(response.type==='clarification')return <ClarificationCard {...response} onSelect={onSearch} locale={locale}/>;
 if(response.type==='no_result')return <section className="empty"><SearchX/><h2>{response.message}</h2><p>{t(locale,'retry')}</p>{response.suggestions?.length>0&&<div className="results-grid">{response.suggestions.map(s=><ServiceCard key={s.intent||s.serviceName} service={s} locale={locale}/>)}</div>}</section>;
 const multiple=response.results.length>1; const documents=response.subtype==='digilocker_documents';
 return <section className="results"><div className="section-heading"><div><span className="eyebrow">{documents?'DigiLocker documents':multiple?t(locale,'related'):'Best match'}</span><h2>{documents?'Choose the matching document':multiple?t(locale,'related'):t(locale,'found')}</h2>{documents&&<p className="result-guidance">Select a document below. DigiLocker may ask you to sign in before you fetch or open it.</p>}</div><p>{multiple?`${response.results.length} possible matches`:t(locale,'matched')} for “{response.query}”</p></div><div className="results-grid" style={multiple?undefined:{gridTemplateColumns:'minmax(0, 560px)'}}>{response.results.map(s=><ServiceCard key={s.intent||s.serviceName} service={s} primary={!multiple&&!documents} locale={locale}/>)}</div></section>
}
