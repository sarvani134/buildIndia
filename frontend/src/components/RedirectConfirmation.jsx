import React, { useEffect, useRef } from 'react';
import { ArrowUpRight, ExternalLink, X } from 'lucide-react';

export default function RedirectConfirmation({ service, onCancel, onConfirm }) {
  const continueButton = useRef(null);
  const domain = new URL(service.officialUrl).hostname.replace(/^www\./, '');
  useEffect(() => {
    continueButton.current?.focus();
    const closeOnEscape = (event) => event.key === 'Escape' && onCancel();
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [onCancel]);
  return <div className="modal-backdrop" onMouseDown={onCancel} role="presentation">
    <section className="redirect-modal" role="alertdialog" aria-modal="true" aria-labelledby="redirect-title" onMouseDown={(event) => event.stopPropagation()}>
      <button className="modal-close" onClick={onCancel} aria-label="Close confirmation"><X /></button>
      <div className="modal-icon"><ExternalLink /></div><span className="eyebrow">Official external website</span>
      <h2 id="redirect-title">Continue to {service.portalName}?</h2>
      <p>You will be redirected from SevaSetu to the official <strong>{service.portalName}</strong> portal.</p>
      <div className="destination"><span>Destination</span><strong>{domain}</strong></div>
      <p className="modal-note">{service.redirectNote || 'Complete authentication and enter personal information only on the official portal.'}</p>
      <div className="modal-actions"><button className="cancel-button" onClick={onCancel}>Cancel</button><button ref={continueButton} className="continue-button" onClick={onConfirm}>Continue to portal <ArrowUpRight /></button></div>
    </section>
  </div>;
}
