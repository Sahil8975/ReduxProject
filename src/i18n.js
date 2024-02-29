import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { LANGUAGE_CODES } from './utils/constants';

i18n
  .use(Backend)
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  .init({
    fallbackLng: LANGUAGE_CODES.EN,
    debug: false, // disable default console.log missing key warning
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });
export default i18n;
