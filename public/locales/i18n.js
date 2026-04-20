import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import Cookies from "js-cookie";

const languageFromCookie = Cookies.get('language') || 'ru';

i18n
    .use(HttpBackend)
    .use(initReactI18next)
    .init({
      backend: {
        loadPath: '/locales/{{lng}}/translation.json',
      },
      lng: languageFromCookie,
      fallbackLng: "ru",
      interpolation: {
        escapeValue: false
      }
    });

export default i18n;