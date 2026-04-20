import React, {useEffect} from "react";
import styles from './entity-delete-branch-popup.module.css';
import {useTranslation} from "react-i18next";

interface DeleteConfirmationPopupProps {
  active: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemType: string;
}

const EntityDeleteBranchPopup: React.FC<DeleteConfirmationPopupProps> = ({
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
        <h3 className={styles.popupHeader}>{t('entityPage.popup.deleteBranch.title')} {itemType}</h3>
        <div className={styles.content}>
          <p className={styles.message}>
            {t('entityPage.popup.deleteBranch.message')} {itemType} <strong>"{itemName}"</strong>?
          </p>
          <p className={styles.warning}>{t('entityPage.popup.deleteBranch.warning')}</p>
          <div className={styles.buttonBox}>
            <button
              onClick={onClose}
              className={styles.cancelButton}
            >
              {t('entityPage.popup.deleteBranch.cancelButtonText')}
            </button>
            <button
              onClick={onConfirm}
              className={styles.deleteButton}
            >
              {t('entityPage.popup.deleteBranch.submitButtonText')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntityDeleteBranchPopup;