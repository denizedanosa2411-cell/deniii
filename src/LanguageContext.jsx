import { createContext, useContext, useMemo, useState } from 'react';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('ru');
  const value = useMemo(() => ({ lang, setLang }), [lang]);
  return (
    <LanguageContext value={value}>
      {children}
    </LanguageContext>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage нужно вызывать внутри LanguageProvider');
  return ctx;
}
