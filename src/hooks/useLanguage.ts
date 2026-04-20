import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';

export const useLanguage = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  const changeLanguage = async (lng: string) => {
    try {
      await i18n.changeLanguage(lng);
      Cookies.set('lang', lng, { expires: 365 });
      setCurrentLanguage(lng);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        const language = Cookies.get('lang');
        const supportedLanguages = ['en', 'ru'];

        let langToSet = language;

        if (!langToSet || !supportedLanguages.includes(langToSet)) {
          const browserLanguage = navigator.language.split('-')[0];
          langToSet = supportedLanguages.includes(browserLanguage) ? browserLanguage : 'en';
        }

        await i18n.changeLanguage(langToSet);
        Cookies.set('lang', langToSet, { expires: 365 });
        setCurrentLanguage(langToSet);

      } catch (error) {
        console.error('Error initializing language:', error);
      }
    };

    initializeLanguage();
  }, [i18n]);

  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      setCurrentLanguage(lng);
    };

    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  return {
    currentLanguage,
    changeLanguage,
    supportedLanguages: ['en', 'ru']
  };
};