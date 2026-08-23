import React from 'react';
import { SearchX } from 'lucide-react';
import ServiceCard from './ServiceCard.jsx';
import ClarificationCard from './ClarificationCard.jsx';
export default function SearchResults({response,onSearch}){
 if(!response)return null;
 if(response.type==='clarification')return <ClarificationCard {...response} onSelect={onSearch}/>;
 if(response.type==='no_result')return <section className="empty"><SearchX/><h2>{response.message}</h2><p>Try rephrasing your request, browse a category, or choose a possible service below.</p>{response.suggestions?.length>0&&<div className="results-grid">{response.suggestions.map(s=><ServiceCard key={s.intent||s.serviceName} service={s}/>)}</div>}</section>;
 const multiple=response.results.length>1; const documents=response.subtype==='digilocker_documents';
 return <section className="results"><div className="section-heading"><div><span className="eyebrow">{documents?'DigiLocker documents':multiple?'Related services':'Best match'}</span><h2>{documents?'Choose the matching document':multiple?'Choose the service you need':'Here’s the service you need'}</h2>{documents&&<p className="result-guidance">Select a document below. DigiLocker may ask you to sign in before you fetch or open it.</p>}</div><p>{multiple?`${response.results.length} possible matches`:'Matched'} for “{response.query}”</p></div><div className="results-grid">{response.results.map(s=><ServiceCard key={s.intent||s.serviceName} service={s}/>)}</div></section>
}
