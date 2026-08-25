import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  BadgeIndianRupee,
  BookOpenCheck,
  Building2,
  FileBadge,
  FileText,
  GraduationCap,
  HandHeart,
  HeartPulse,
  HomeIcon,
  Info,
  Landmark,
  BriefcaseBusiness,
  Bus,
  CircleUserRound,
  Scale,
  Sprout,
  TrainFront,
  ShieldAlert,
  Store,
  WalletCards
} from 'lucide-react';

import Navbar from '../components/Navbar.jsx';
import SearchBar from '../components/SearchBar.jsx';
import Suggestions from '../components/Suggestions.jsx';
import SearchResults from '../components/SearchResults.jsx';
import ServiceCard from '../components/ServiceCard.jsx';
import { browseServices, searchServices } from '../services/api.js';
import { t } from '../i18n.js';
import sevaSetuLogo from '../assets/seva-setu-logo.png';

const CATEGORIES = [
  ['Identity', CircleUserRound],
  ['Certificates', FileBadge],
  ['Documents', FileText],
  ['Transport', Bus],
  ['Travel', TrainFront],
  ['Employment', BriefcaseBusiness],
  ['Agriculture', Sprout],
  ['Education', GraduationCap],
  ['Health', HeartPulse],
  ['Pension', WalletCards],
  ['Tax', Landmark],
  ['Benefits', HandHeart],
  ['Utilities', Building2],
  ['Housing', HomeIcon],
  ['Finance', BadgeIndianRupee],
  ['Grievances', FileText],
  ['Cyber Crime', ShieldAlert],
  ['Legal', Scale],
  ['Local Services', Store],
  ['Business', BriefcaseBusiness],
  ['Postal', BookOpenCheck],
  ['Information', Info]
];

export default function Home() {
  const [response, setResponse] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('');
  const [categoryServices, setCategoryServices] = useState([]);
  const [locale, setLocale] = useState(
    () => localStorage.getItem('sevasetu-language') || 'en'
  );

  const resultRef = useRef();

  useEffect(() => {
    localStorage.setItem('sevasetu-language', locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ur' ? 'rtl' : 'ltr';
  }, [locale]);

  const search = async (query) => {
    setLoading(true);
    setError('');
    setCategory('');

    try {
      setResponse(await searchServices(query));

      setTimeout(() => {
        resultRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 50);
    } catch (e) {
      setError(
        e.response?.data?.message ||
          'The service finder is unavailable. Is the backend running?'
      );
    } finally {
      setLoading(false);
    }
  };

  const browse = async (name) => {
    setCategory(name);
    setResponse();
    setError('');

    try {
      setCategoryServices(await browseServices(name));

      setTimeout(() => {
        resultRef.current?.scrollIntoView({
          behavior: 'smooth'
        });
      }, 50);
    } catch {
      setError('Could not load this category.');
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

          {category && (
            <section className="results">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">
                    Browse category
                  </span>

                  <h2>
                    {category} services
                  </h2>
                </div>
              </div>

              <div className="results-grid">
                {categoryServices.map((s) => (
                  <ServiceCard
                    key={s.serviceName}
                    service={s}
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        <section className="browse">
          <h2>{t(locale, 'browse')}</h2>

          <p>{t(locale, 'browseHelp')}</p>

          <div className="category-grid">
            {CATEGORIES.map(([name, Icon]) => (
              <button
                className={category === name ? 'active' : ''}
                onClick={() => browse(name)}
                key={name}
              >
                <Icon />
                <span>{name}</span>
                <ArrowRight />
              </button>
            ))}
          </div>
        </section>

        <section className="trust">
          <div>
            <img
              src={sevaSetuLogo}
              alt="Seva Setu logo"
              style={{ width: 44, height: 44, objectFit: 'contain', display: 'block' }}
            />
          </div>

          <div>
            <h2>A safe bridge to public services</h2>

            <p>
              SevaSetu only routes you to links held in our
              trusted service registry. It does not replace
              official authentication or collect sensitive
              credentials.
            </p>
          </div>
        </section>
      </main>

      <footer>
        <div className="brand">
          <span className="brand-icon">
            <img src={sevaSetuLogo} alt="Seva Setu logo" />
          </span>

          <span>
            Seva<span>Setu</span>
          </span>
        </div>

        <p>
          Users describe the task. We find the service.
        </p>

        <span>
          Built for accessible Digital India services.
        </span>
      </footer>
    </>
  );
}
