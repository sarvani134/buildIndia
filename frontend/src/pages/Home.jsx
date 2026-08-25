import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import SearchBar from '../components/SearchBar.jsx';
import Suggestions from '../components/Suggestions.jsx';
import SearchResults from '../components/SearchResults.jsx';
import { searchServices } from '../services/api.js';
import { t } from '../i18n.js';

export default function Home() {
  const [response, setResponse] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locale, setLocale] = useState(
    () => localStorage.getItem('sevasetu-language') || 'en'
  );

  const resultRef = useRef();

  useEffect(() => {
    localStorage.setItem('sevasetu-language', locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ur' ? 'rtl' : 'ltr';
  }, [locale]);

  useEffect(() => {
    if (loading || (!response && !error)) return;

    const frame = requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [loading, response, error]);

  const search = async (query) => {
    setLoading(true);
    setError('');

    try {
      setResponse(await searchServices(query));
    } catch (e) {
      setError(
        e.response?.data?.message ||
          'The service finder is unavailable. Is the backend running?'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar locale={locale} onLocaleChange={setLocale} />

      <main>
        <section className="hero">
          <div className="flag-line">
            <span></span>
            <p>One search. Every government service.</p>
            <span></span>
          </div>

          <h1>{t(locale, 'hero')}</h1>

          <p className="subtitle">
            {t(locale, 'subtitle')}
          </p>

          <SearchBar
            onSearch={search}
            loading={loading}
            locale={locale}
          />

          <Suggestions
            onSelect={search}
            locale={locale}
          />

          <p className="privacy">
            {t(locale, 'privacy')}
          </p>
        </section>

        <div ref={resultRef} className="result-anchor">
          {loading && (
            <div className="loading">
              <span></span>
              <p>{t(locale, 'loading')}</p>
            </div>
          )}

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          <SearchResults
            response={response}
            onSearch={search}
            locale={locale}
          />

        </div>
      </main>
    </>
  );
}
