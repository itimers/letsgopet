import en from './locales/en.json';
import ru from './locales/ru.json';
import sr from './locales/sr.json';
import de from './locales/de.json';
import it from './locales/it.json';
import cn from './locales/cn.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import tr from './locales/tr.json';


export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'sr',
  strategy: 'prefix_except_default',
  lazy: true,
  langDir: './locales/',
  locales: [
    { code: 'en', iso: 'en-US', file: 'en.json', name: "English" },
    { code: 'sr', iso: 'sr-RS', file: 'sr.json', name: "Srpski" },
    { code: 'ru', iso: 'ru-RU', file: 'ru.json', name: "Ruski" },
    { code: 'de', iso: 'de-DE', file: 'de.json', name: "Deutsch" },
    { code: 'it', iso: 'it-IT', file: 'it.json', name: "Italiano" },
    { code: 'cn', iso: 'zh-CN', file: 'cn.json', name: "中文" },
    { code: 'es', iso: 'es-ES', file: 'es.json', name: "Español" },
    { code: 'fr', iso: 'fr-FR', file: 'fr.json', name: "Français" },
    { code: 'tr', iso: 'tr-TR', file: 'tr.json', name: "Türkçe" }
  ],
  fallbackLocale: 'sr',
  messages: {
    en,
    sr,
    ru,
    de,
    it,
    cn,
    es,
    fr,
    tr
  },
  detectBrowserLanguage: {
    useCookie: true,
    cookieKey: 'i18n_redirected',
    alwaysRedirect: true,
    fallbackLocale: 'sr'
  },

  defaultLocale: 'sr',
}));
