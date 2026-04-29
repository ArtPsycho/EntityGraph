import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";

// Импортируем переводы синхронно для Electron
import enTranslation from './en/translation.json';
import ruTranslation from './ru/translation.json';

const isElectron = !!(window.electronAPI && window.electronAPI.isElectron);

// Функции для работы с localStorage
const getLanguage = () => {
    const savedLanguage = localStorage.getItem('language');
    const supportedLanguages = ['en', 'ru'];
    if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
        return savedLanguage;
    }
    const browserLanguage = navigator.language.split('-')[0];
    return supportedLanguages.includes(browserLanguage) ? browserLanguage : 'ru';
};

const languageFromLocal = getLanguage();

// Синхронная инициализация для обоих окружений
if (isElectron) {
    // Для Electron - синхронно используем встроенные переводы
    i18n
        .use(initReactI18next)
        .init({
            resources: {
                en: { translation: enTranslation },
                ru: { translation: ruTranslation },
            },
            lng: languageFromLocal,
            fallbackLng: "ru",
            interpolation: {
                escapeValue: false
            }
        });
} else {
    // Для веба - используем HTTP загрузку (это асинхронно, но сработает быстро)
    i18n
        .use(HttpBackend)
        .use(initReactI18next)
        .init({
            backend: {
                loadPath: '/locales/{{lng}}/translation.json',
            },
            lng: languageFromLocal,
            fallbackLng: "ru",
            interpolation: {
                escapeValue: false
            }
        });
}

export default i18n;