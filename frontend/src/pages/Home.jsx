import React, { useRef, useState } from 'react';
import SearchBar from '../components/SearchBar.jsx';
import Suggestions from '../components/Suggestions.jsx';
import SearchResults from '../components/SearchResults.jsx';
import { searchServices } from '../services/api.js';

export default function Home() {
  const [response, setResponse] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const resultRef = useRef();

  const search = async (query) => {
    setLoading(true);
    setError('');
    try {
      setResponse(await searchServices(query));
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    } catch (e) {
      setError(e.response?.data?.message || 'The service finder is unavailable. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return <>
    <main>
      <section className="hero">
        <div className="tricolor-line" aria-hidden="true"><span></span><i></i><span></span></div>
        <a className="hero-brand" href="/" aria-label="SevaSetu Smart Search home">
          <span className="hero-brand-mark" aria-hidden="true"><i></i></span>
          <span className="hero-brand-copy"><strong>Seva<span>Setu</span></strong><small>Smart Search</small></span>
        </a>
        <h1>What government service<br />do you <em>need?</em></h1>
        <p className="subtitle">Describe what you want to do in your own words. We’ll guide you to the right official service—safely and simply.</p>
        <SearchBar onSearch={search} loading={loading} />
        <Suggestions onSelect={search} />
        <p className="privacy">We never ask for Aadhaar numbers, OTPs, passwords, or banking details.</p>
      </section>
      <div ref={resultRef} className="result-anchor">
        {loading && <div className="loading"><span></span><p>Understanding your request...</p></div>}
        {error && <div className="error">{error}</div>}
        <SearchResults response={response} onSearch={search} />
      </div>
    </main>
  </>;
}
