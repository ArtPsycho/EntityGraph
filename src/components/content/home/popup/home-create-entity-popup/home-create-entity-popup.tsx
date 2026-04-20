import React, {useEffect, useState} from "react";
import styles from './home-create-entity-popup.module.css';
import {createEntity} from "../../../../../services/entityManager";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

interface PopupProps {
  active: boolean;
  onClose: () => void;
}

const HomeCreateEntityPopup: React.FC<PopupProps> = ({ active, onClose }) => {
  if (!active) return null;

  const navigate = useNavigate();

  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (i18n.language) {
    }
  }, [i18n.language]);

  const [newEntityName, setNewEntityName] = useState<string>('');

  const handleCreateEntity = async (): Promise<void> => {
    if (newEntityName.trim()) {
      const newEntity = await createEntity(newEntityName);
      setNewEntityName('');
      // setShowCreateForm(false);
      onClose();
      // await loadEntities();
      navigate(`/entity/${newEntity.fileName}`);
    }
  };

  return (
    <div className={styles.popup}>
      <h3 className={styles.title}>{t('homePage.popup.createEntity.title')}</h3>
      <div className={styles.createForm}>
        <input
          type="text"
          placeholder={t('homePage.popup.createEntity.inputNamePlaceholder')}
          value={newEntityName}
          onChange={(e) => setNewEntityName(e.target.value)}
          autoFocus
        />
        <div className={styles.buttonBox}>
          <button
            onClick={() => onClose()}
            className={styles.cancelButton}
          >
            {t('homePage.popup.createEntity.cancelButtonText')}
          </button>
          <button
            onClick={handleCreateEntity}
            className={styles.submitButton}
          >
            {t('homePage.popup.createEntity.submitButtonText')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default HomeCreateEntityPopup;