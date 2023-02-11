import i18n, { StringMap, TOptions } from 'i18next';
import en from './resources/en';
import fr from './resources/fr';

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: en,
  },
  fr: {
    translation: fr,
  },
};

i18n.init({
  resources,
  lng: 'en',
  // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
  // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
  // if you're using a language detector, do not define the lng option

  interpolation: {
    escapeValue: false, // react already safes from xss
  },
  fallbackLng: 'en', // use en if detected lng is not available
});

/**
 * 全局使用的翻译方法，不会响应lng切换
 * @param key i18n的key
 * @param option
 * @returns
 */
export function t(key: string, option?: string | TOptions<StringMap>) {
  return i18n.t(key, option);
}

console.log(t('Welcome to React', { name: 'hshs' }));
