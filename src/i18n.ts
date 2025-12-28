import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zhCN from './locales/zh-CN.json';
import enUS from './locales/en-US.json';

// the translations
const resources = {
    'zh-CN': {
        translation: zhCN
    },
    'en': {
        translation: enUS
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'zh-CN', // default language is Chinese
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;
