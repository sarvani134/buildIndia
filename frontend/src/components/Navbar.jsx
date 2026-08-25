import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { LANGUAGES, t } from '../i18n.js';
import sevaSetuLogo from '../assets/seva-setu-logo.png';

export default function Navbar({locale,onLocaleChange}){return <header className="nav"><a className="brand" href="/"><span className="brand-icon"><img src={sevaSetuLogo} alt="Seva Setu logo" /></span><span>Seva<span>Setu</span></span></a><div className="nav-actions"><label className="language-select"><span>{t(locale,'language')}</span><select value={locale} onChange={(event)=>onLocaleChange(event.target.value)} aria-label={t(locale,'language')}>{LANGUAGES.map(([code,label])=><option value={code} key={code}>{label}</option>)}</select></label><div className="nav-trust"><ShieldCheck/> {t(locale,'trusted')}</div></div></header>}
