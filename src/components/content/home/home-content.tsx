import React, {useCallback, useEffect, useRef, useState} from 'react';
import styles from './home-content.module.css';
import {EntityList} from "../../entity/EntityList/EntityList";
import {EntityListItem} from "../../../types/entity";
import {useNavigate} from "react-router-dom";
import {createEntity, getAllEntities, getEntity, importEntity, removeEntity} from "../../../services/entityManager";
import {exportData, importData} from "../../../services/storage";
import HomeCreateEntityPopup from "./popup/home-create-entity-popup/home-create-entity-popup";
import {DefaultGraphIcon} from "../../../assets/images/icons/graph_icon";
import {DefaultQuestionMarkIcon} from "../../../assets/images/icons/question-mark_icon";
import HomeInfoPopup from "./popup/home-info-popup/home-info-popup";
import {DefaultUploadFileIcon} from "../../../assets/images/icons/upload-file_icon";
import HomeDeleteEntityPopup from "./popup/home-delete-entity-popup/home-delete-entity-popup";
import {DefaultSettingsThemeLightIcon} from "../../../assets/images/icons/settings-theme-light_icon";
import {DefaultSettingsThemeDarkIcon} from "../../../assets/images/icons/settings-theme-dark_icon";
import {useTheme} from "../../../hooks/useTheme";
import {useTranslation} from "react-i18next";
import {DefaultLanguageIcon} from "../../../assets/images/icons/language_icon";
import {DefaultArrowDropDownIcon} from "../../../assets/images/icons/arrow-drop-down_icon";
import HomeTutorialPopup from "./popup/home-tutorial-popup/home-tutorial-popup";
import HomeUpdatesPopup from "./popup/home-updates-popup/home-updates-popup";

type SortType = 'createdAtDesc' | 'createdAtAsc' | 'updatedAtDesc' | 'updatedAtAsc' | 'nameAsc' | 'nameDesc';

const HomeContent = () => {
  const [entities, setEntities] = useState<EntityListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [showInfoPopup, setShowInfoPopup] = useState<boolean>(false);
  const [sortType, setSortType] = useState<SortType>('updatedAtDesc');
  const [isDeletePopupActive, setIsDeletePopupActive] = useState<boolean>(false);
  const [entityToDelete, setEntityToDelete] = useState<EntityListItem | null>(null);
  const [isUpdateListPopupActive, setIsUpdateListPopupActive] = useState<boolean>(false);

  const navigate = useNavigate();

  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (i18n.language) {
    }
  }, [i18n.language]);

  const getLocalStorage = (key: string, defaultValue: any = null) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  };

  const setLocalStorage = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const loadEntities = useCallback(async (): Promise<void> => {
    // setLoading(true);
    const allEntities = await getAllEntities();
    setEntities(allEntities);
    // setLoading(false);
  }, []);

  useEffect(() => {
    loadEntities();
  }, [loadEntities]);

  const sortEntities = (entitiesToSort: EntityListItem[]): EntityListItem[] => {
    const sorted = [...entitiesToSort];

    switch (sortType) {
      case 'createdAtDesc':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'createdAtAsc':
        return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'updatedAtDesc':
        return sorted.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      case 'updatedAtAsc':
        return sorted.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
      case 'nameAsc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'nameDesc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return sorted;
    }
  };


  const handleDeleteEntity = async (): Promise<void> => {
    if (entityToDelete) {
      await removeEntity(entityToDelete.fileName);
      await loadEntities();
      setIsDeletePopupActive(false);
      setEntityToDelete(null);
    }
  };

  const openDeleteConfirmation = (entity: EntityListItem): void => {
    setEntityToDelete(entity);
    setIsDeletePopupActive(true);
  };

  const handleExportEntity = async (entity: EntityListItem): Promise<void> => {
    const fullEntity = await getEntity(entity.fileName);
    if (fullEntity) {
      await exportData(fullEntity, `${entity.name}.json`);
    }
  };

  const handleImport = async (): Promise<void> => {
    const importedData = await importData();

    if (!importedData) {
      alert(`${t('homePage.alert.noDataImport')}`);
      return;
    }

    if (Array.isArray(importedData)) {
      for (const entity of importedData) {
        await importEntity(entity);
      }
      await loadEntities();
      // alert('Entities imported successfully!');
    } else {
      await importEntity(importedData);
      await loadEntities();
      // alert('Entity imported successfully!');
    }
  };


  const { currentTheme, setTheme, getTheme } = useTheme();

  const handleThemeChange = () => {
    const theme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    if (theme) {
      switch (theme) {
        case 'light':
          setTheme('dark');
          break;
        case 'dark':
          setTheme('light');
          break;
        case 'system':
          if (prefersDark.matches) {
            setTheme('light');
          } else {
            setTheme('dark');
          }
          break;
      }
    }
  }

  const ThemeSwitcherIcon = () => {
    const theme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    if (theme) {
      switch (theme) {
        case 'light':
          return <DefaultSettingsThemeLightIcon width="30px" height="30px" />;
        case 'dark':
          return <DefaultSettingsThemeDarkIcon width="30px" height="30px" />;
        case 'system':
          return prefersDark.matches ? (
            <DefaultSettingsThemeDarkIcon width="30px" height="30px" />
          ) : (
            <DefaultSettingsThemeLightIcon width="30px" height="30px" />
          );
        default:
          return <DefaultSettingsThemeLightIcon width="30px" height="30px" />;
      }
    }
  }

  // if (loading) {
  //   return (
  //     <div className={styles.loading}>
  //       <DefaultGraphIcon width="50px" height="50px" color="3f3f3f"/>
  //     </div>);
  // }

  const [activeLanguage, setActiveLanguage] = useState(localStorage.getItem('language') || 'en');
  const [isLanguagePopupOpen, setIsLanguagePopupOpen] = useState(false);
  const languageSwitcherRef = useRef<HTMLDivElement>(null);

  // Переключение языка
  useEffect(() => {
    const language = localStorage.getItem('language') || 'ru';
    setActiveLanguage(language);
    i18n.changeLanguage(language);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageSwitcherRef.current && !languageSwitcherRef.current.contains(event.target as Node)) {
        setIsLanguagePopupOpen(false);
      }
    };

    if (isLanguagePopupOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLanguagePopupOpen]);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    setActiveLanguage(lang);
    localStorage.setItem('language', lang);
    setIsLanguagePopupOpen(false);
  };

  const togglePopup = () => {
    setIsLanguagePopupOpen(!isLanguagePopupOpen);
  };

  const sortedEntities = sortEntities(entities);

  const [showTutorialPopup, setShowTutorialPopup] = useState(false);

  const handleSkipTutorial = () => {
    localStorage.setItem('tutorialCompleted', 'true');
    setShowTutorialPopup(false);
  };

  useEffect(() => {
    const tutorialCompleted = localStorage.getItem('tutorialCompleted');
    if (!tutorialCompleted) {
      setShowTutorialPopup(true);
    }
  }, []);

  return (
    <div className={styles.content}>
      <header className={styles.header}>
        <div className={styles.headerTitleBox}>
          <span className={styles.headerIcon}>
            <DefaultGraphIcon width="28px" height="28px" />
          </span>
          <h1 className={styles.headerTitle}>Entity Graph</h1>
        </div>

        <div className={styles.headerInteraction}>

          <button
            className={styles.tutorialButton}
            onClick={() => setIsUpdateListPopupActive(true)}
          >
            {t('homePage.content.header.updatesButtonText')}
          </button>

          <button
            className={styles.tutorialButton}
            onClick={() => setShowTutorialPopup(true)}
          >
            {t('homePage.content.header.tutorialButtonText')}
          </button>

          <div
            className={styles.languageSwitcher}
            onClick={togglePopup}
            ref={languageSwitcherRef}
          >
            <span className={styles.currentLanguageText}>{t('currentLanguage')}</span>
            <span className={styles.languageArrowIcon}>
              <DefaultArrowDropDownIcon width="20px" height="20px" />
            </span>
            {isLanguagePopupOpen && (
              <div className={styles.languagePopup}>
                <div onClick={(e) => e.stopPropagation()}>
                  <div
                    className={`${styles.languageButton} ${activeLanguage === 'en' ? styles.active : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLanguageChange('en');
                    }}
                  >
                    <p className={styles.languageText}>English</p>
                    {activeLanguage === 'en' && <>✓</>}
                  </div>

                  <div
                    className={`${styles.languageButton} ${activeLanguage === 'ru' ? styles.active : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLanguageChange('ru');
                    }}
                  >
                    <p className={styles.languageText}>Русский</p>
                    {activeLanguage === 'ru' && <>✓</>}
                  </div>
                </div>
              </div>
            )}
          </div>
          <button className={styles.themeSwitcher} onClick={handleThemeChange}>
            <span className={styles.themeSwitcherIcon}>
              {/*<DefaultSettingsThemeLightIcon width="30px" height="30px" />*/}
              <ThemeSwitcherIcon />
            </span>
          </button>

        </div>
      </header>

      <div className={styles.mainBox}>
        <div className={styles.homePageInteraction}>
          <div className={styles.sortEntities}>
            <span className={styles.sortLabel}>{t('homePage.content.sort.sortButtonLabel')}</span>
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value as SortType)}
              className={styles.sortSelect}
            >
              <optgroup label={t('homePage.content.sort.groupCreatedLabel')}>
                <option value="createdAtDesc">{t('homePage.content.sort.optionCreatedAtDesc')}</option>
                <option value="createdAtAsc">{t('homePage.content.sort.optionCreatedAtAsc')}</option>
              </optgroup>
              <optgroup label={t('homePage.content.sort.groupUpdatedLabel')}>
                <option value="updatedAtDesc">{t('homePage.content.sort.optionUpdatedAtDesc')}</option>
                <option value="updatedAtAsc">{t('homePage.content.sort.optionUpdatedAtAsc')}</option>
              </optgroup>
              <optgroup label={t('homePage.content.sort.groupNameLabel')}>
                <option value="nameAsc">{t('homePage.content.sort.optionNameAsc')}</option>
                <option value="nameDesc">{t('homePage.content.sort.optionNameDesc')}</option>
              </optgroup>
            </select>
          </div>
          <div className={styles.createSection}>
            <button
              onClick={() => handleImport()}
              className={styles.importButton}
            >
              {t('homePage.content.create.importButtonText')}
              <DefaultUploadFileIcon width="20px" height="20px" color="#fff" />
            </button>

            <button
              onClick={() => setShowCreateForm(true)}
              className={styles.createButton}
            >
              {t('homePage.content.create.createButtonText')}
            </button>
          </div>
        </div>
        <EntityList
          entities={sortedEntities}
          onDelete={openDeleteConfirmation}
          onExport={handleExportEntity}
        />
        <HomeCreateEntityPopup
          active={showCreateForm}
          onClose={() => setShowCreateForm(false)}
        />
      </div>

      <button
        className={styles.infoPopupButton}
        onClick={() => setShowInfoPopup(true)}
      >
        <DefaultQuestionMarkIcon width="24px" height="24px" />
      </button>

      <HomeInfoPopup
        active={showInfoPopup}
        onClose={() => setShowInfoPopup(false)}
      />

      <HomeDeleteEntityPopup
        active={isDeletePopupActive}
        onClose={() => setIsDeletePopupActive(false)}
        onConfirm={() => handleDeleteEntity()}
        itemName={entityToDelete?.name || ''}
        itemType={t('homePage.popup.deleteEntity.itemType')}
      />

      <HomeTutorialPopup
        active={showTutorialPopup}
        onClose={() => setShowTutorialPopup(false)}
        onSkip={handleSkipTutorial}
      />
      <HomeUpdatesPopup
        active={isUpdateListPopupActive}
        onClose={() => setIsUpdateListPopupActive(false)}
      />
    </div>
  );
}

export default HomeContent;