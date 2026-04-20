import React, {useEffect} from "react";
import styles from './entity-delete-point-popup.module.css';
import {useTranslation} from "react-i18next";

interface DeleteConfirmationPopupProps {
  active: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemType: string;
}

const EntityDeletePointPopup: React.FC<DeleteConfirmationPopupProps> = ({
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
        <h3 className={styles.popupHeader}>{t('entityPage.popup.deletePoint.title')} {itemType}</h3>
        <div className={styles.content}>
          <p className={styles.message}>
            {t('entityPage.popup.deletePoint.message')} {itemType} <strong>"{itemName}"</strong>?
          </p>
          <p className={styles.warning}>{t('entityPage.popup.deletePoint.warning')}</p>
          <div className={styles.buttonBox}>
            <button
              onClick={onClose}
              className={styles.cancelButton}
            >
              {t('entityPage.popup.deletePoint.cancelButtonText')}
            </button>
            <button
              onClick={onConfirm}
              className={styles.deleteButton}
            >
              {t('entityPage.popup.deletePoint.submitButtonText')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntityDeletePointPopup;