import { useLanguage } from '../LanguageContext.jsx';

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <button onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')}>
      {lang === 'ru' ? 'English' : 'Русский'}
    </button>
  );
}
