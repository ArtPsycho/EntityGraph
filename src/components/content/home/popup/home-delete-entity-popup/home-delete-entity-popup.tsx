import React, {useEffect} from "react";
import styles from './home-delete-entity-popup.module.css';
import {useTranslation} from "react-i18next";

interface DeleteConfirmationPopupProps {
  active: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemType: string;
}

const HomeDeleteEntityPopup: React.FC<DeleteConfirmationPopupProps> = ({
  active,
  onClose,
  onConfirm,
  itemName,
  itemType
}) => {
  if (!active) return null;

  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (i18n.language) {
    }
  }, [i18n.language]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.popupHeader}>{t('homePage.popup.deleteEntity.title')} {itemType}</h3>
        <div className={styles.content}>
          <p className={styles.message}>
            {t('homePage.popup.deleteEntity.message')} {itemType} <strong>"{itemName}"</strong>?
          </p>
          <p className={styles.warning}>{t('homePage.popup.deleteEntity.warning')}</p>
          <div className={styles.buttonBox}>
            <button
              onClick={onClose}
              className={styles.cancelButton}
            >
              {t('homePage.popup.deleteEntity.cancelButtonText')}
            </button>
            <button
              onClick={onConfirm}
              className={styles.deleteButton}
            >
              {t('homePage.popup.deleteEntity.submitButtonText')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeDeleteEntityPopup;