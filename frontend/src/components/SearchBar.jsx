import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Search, Sparkles } from 'lucide-react';
export default function SearchBar({onSearch,loading,initial=''}){
 const [query,setQuery]=useState(initial); const [listening,setListening]=useState(false); const recognition=useRef();
 useEffect(()=>setQuery(initial),[initial]);
 const voice=()=>{ const Speech=window.SpeechRecognition||window.webkitSpeechRecognition; if(!Speech)return; const rec=new Speech(); recognition.current=rec; rec.lang='en-IN'; rec.onstart=()=>setListening(true); rec.onend=()=>setListening(false); rec.onresult=(e)=>setQuery(e.results[0][0].transcript); rec.start(); };
 const submit=(e)=>{e.preventDefault(); if(query.trim())onSearch(query.trim())};
 const voiceSupported=typeof window!=='undefined'&&Boolean(window.SpeechRecognition||window.webkitSpeechRecognition);
 return <form className="search-shell" onSubmit={submit}><Sparkles className="spark"/><input aria-label="Describe the government service you need" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Try: renew my licence, check PF balance, book a train..."/>{voiceSupported&&<button className="icon-btn" type="button" onClick={voice} aria-label="Search by voice">{listening?<MicOff/>:<Mic/>}</button>}<button className="search-btn" disabled={loading||!query.trim()}><Search/> <span>Search</span></button></form>
}
