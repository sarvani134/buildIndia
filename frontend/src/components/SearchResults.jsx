import React from 'react';
import { SearchX } from 'lucide-react';
import ServiceCard from './ServiceCard.jsx';
import ClarificationCard from './ClarificationCard.jsx';
import { t } from '../i18n.js';

export default function SearchResults({ response, onSearch, locale = 'en' }) {
  if (!response) return null;

  if (response.type === 'clarification') {
    return <ClarificationCard {...response} onSelect={onSearch} locale={locale} />;
  }

  if (response.type === 'no_result') {
    return <section className="empty">
      <SearchX />
      <h2>{response.message}</h2>
      <p>{t(locale, 'retry')}</p>
      {response.suggestions?.length > 0 && <div className="results-grid">
        {response.suggestions.map((service) => <ServiceCard key={service.intent || service.serviceName} service={service} locale={locale} />)}
      </div>}
    </section>;
  }

  const multiple = response.results.length > 1;
  const documentsOnly = response.subtype === 'digilocker_documents';
  const combined = response.subtype === 'service_with_digilocker_documents';
  const hasDocuments = documentsOnly || combined;

  const eyebrow = combined
    ? 'Official service + DigiLocker'
    : documentsOnly
      ? 'DigiLocker documents'
      : multiple
        ? t(locale, 'related')
        : 'Best match';

  const heading = combined
    ? 'Service and matching digital document'
    : documentsOnly
      ? 'Choose the matching document'
      : multiple
        ? t(locale, 'related')
        : t(locale, 'found');

  return <section className="results">
    <div className="section-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{heading}</h2>
        {hasDocuments && <p className="result-guidance">
          Open the government service for related actions, or choose the DigiLocker card to fetch the matched digital document.
        </p>}
      </div>
      <p>{multiple ? `${response.results.length} possible matches` : t(locale, 'matched')} for “{response.query}”</p>
    </div>
    <div className="results-grid" style={multiple ? undefined : { gridTemplateColumns: 'minmax(0, 560px)' }}>
      {response.results.map((service) => <ServiceCard
        key={service.intent || service.serviceName}
        service={service}
        primary={!multiple && !hasDocuments}
        locale={locale}
      />)}
    </div>
  </section>;
}
