import React, { useEffect, useRef, useState } from 'react';
import { CornerDownLeft, Mic, MicOff, Search, Sparkles } from 'lucide-react';
import { getSearchSuggestions } from '../services/api.js';
import { speechLocales, t } from '../i18n.js';

export default function SearchBar({ onSearch, loading, locale = 'en', initial = '' }) {
  const [query, setQuery] = useState(initial);
  const [listening, setListening] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const recognition = useRef();
  const shell = useRef();
  const input = useRef();
  const suppressSuggestions = useRef(false);
  const allowSuggestions = useRef(true);

  useEffect(() => setQuery(initial), [initial]);

  useEffect(() => {
    const close = (event) => !shell.current?.contains(event.target) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  useEffect(() => {
    if (suppressSuggestions.current) {
      suppressSuggestions.current = false;
      return;
    }

    if (!allowSuggestions.current || loading || query.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const items = await getSearchSuggestions(query);
        if (cancelled) return;
        setSuggestions(items);
        setOpen(items.length > 0);
        setActive(-1);
      } catch {
        if (!cancelled) setSuggestions([]);
      }
    }, 220);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, loading]);

  useEffect(() => {
    if (loading) setOpen(false);
  }, [loading]);

  const voice = () => {
    const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Speech) return;
    const rec = new Speech();
    recognition.current = rec;
    rec.lang = speechLocales[locale] || speechLocales.en;
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onresult = (event) => {
      allowSuggestions.current = true;
      setQuery(event.results[0][0].transcript);
    };
    rec.start();
  };

  const runSearch = (value) => {
    allowSuggestions.current = false;
    setOpen(false);
    setSuggestions([]);
    setActive(-1);
    input.current?.blur();
    onSearch(value);
  };

  const choose = (item) => {
    suppressSuggestions.current = true;
    setQuery(item.query);
    runSearch(item.query);
  };

  const submit = (event) => {
    event.preventDefault();
    if (active >= 0 && open) {
      choose(suggestions[active]);
      return;
    }
    const value = query.trim();
    if (value) runSearch(value);
  };

  const keys = (event) => {
    if (!open) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((index) => (index + 1) % suggestions.length);
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((index) => (index <= 0 ? suggestions.length - 1 : index - 1));
    }
    if (event.key === 'Escape') setOpen(false);
  };

  const voiceSupported = typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

  return <div className="autocomplete" ref={shell}>
    <form className={`search-shell ${open ? 'suggestions-open' : ''}`} onSubmit={submit}>
      <Sparkles className="spark" />
      <input
        ref={input}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls="search-suggestions"
        aria-activedescendant={active >= 0 ? `suggestion-${active}` : undefined}
        aria-label={t(locale, 'subtitle')}
        value={query}
        onChange={(event) => {
          allowSuggestions.current = true;
          setQuery(event.target.value);
        }}
        onFocus={() => !loading && suggestions.length > 0 && setOpen(true)}
        onKeyDown={keys}
        placeholder={t(locale, 'placeholder')}
        autoComplete="off"
      />
      {voiceSupported && <button className="icon-btn" type="button" onClick={voice} aria-label={t(locale, 'search')}>{listening ? <MicOff /> : <Mic />}</button>}
      <button className="search-btn" disabled={loading || !query.trim()}><Search /> <span>{t(locale, 'search')}</span></button>
    </form>
    {open && <div className="autocomplete-menu" id="search-suggestions" role="listbox">
      <p className="suggestion-label">{t(locale, 'related')}</p>
      {suggestions.map((item, index) => <button
        type="button"
        id={`suggestion-${index}`}
        role="option"
        aria-selected={active === index}
        className={active === index ? 'active' : ''}
        key={`${item.label}-${item.portalName}`}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => choose(item)}
        onMouseEnter={() => setActive(index)}
      >
        <Search />
        <span><b>{item.label}</b><small>{item.portalName} · {item.category}</small></span>
        <CornerDownLeft />
      </button>)}
    </div>}
  </div>;
}
