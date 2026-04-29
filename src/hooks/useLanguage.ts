import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const useLanguage = () => {
  const { i18n, t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'ru');
  const [isReady, setIsReady] = useState(false);

  const changeLanguage = async (lng: string) => {
    if (!i18n.changeLanguage) {
      console.error('i18n not ready yet');
      return;
    }
    try {
      await i18n.changeLanguage(lng);
      localStorage.setItem('language', lng);
      setCurrentLanguage(lng);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        // Ждем готовности i18n
        if (!i18n.isInitialized) {
          await new Promise((resolve) => {
            i18n.on('initialized', resolve);
          });
        }

        const language = localStorage.getItem('language');
        const supportedLanguages = ['en', 'ru'];

        let langToSet = language;

        if (!langToSet || !supportedLanguages.includes(langToSet)) {
          const browserLanguage = navigator.language.split('-')[0];
          langToSet = supportedLanguages.includes(browserLanguage) ? browserLanguage : 'ru';
        }

        if (i18n.changeLanguage) {
          await i18n.changeLanguage(langToSet);
          localStorage.setItem('language', langToSet);
          setCurrentLanguage(langToSet);
        }
        setIsReady(true);
      } catch (error) {
        console.error('Error initializing language:', error);
        setIsReady(true);
      }
    };

    if (i18n) {
      initializeLanguage();
    }
  }, [i18n]);

  useEffect(() => {
    if (!i18n) return;

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
    supportedLanguages: ['en', 'ru'],
    isReady
  };
};