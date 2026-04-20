import React, {useEffect, useState} from "react";
import styles from './entity-create-branch-popup.module.css';
import {useTranslation} from "react-i18next";

interface PopupProps {
  active: boolean;
  onClose: () => void;
  onCreateBranch: (branchName: string) => Promise<void>;
}

const EntityCreateBranchPopup: React.FC<PopupProps> = ({
  active,
  onClose,
  onCreateBranch
}) => {
  if (!active) return null;

  const [newBranchName, setNewBranchName] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);


  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (i18n.language) {
    }
  }, [i18n.language]);

  const handleCreateBranch = async (): Promise<void> => {
    if (newBranchName.trim() && !isCreating) {
      setIsCreating(true);
      try {
        await onCreateBranch(newBranchName.trim());
        setNewBranchName('');
        onClose();
      } catch (error) {
        console.error('Error creating branch:', error);
      } finally {
        setIsCreating(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateBranch();
    }
  };

  return (
    <div className={styles.popupOverlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>{t('entityPage.popup.createBranch.title')}</h3>
        <div className={styles.createForm}>
          <input
            type="text"
            placeholder={t('entityPage.popup.createBranch.inputNamePlaceholder')}
            value={newBranchName}
            onChange={(e) => setNewBranchName(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
            disabled={isCreating}
          />
          <div className={styles.buttonBox}>
            <button
              onClick={onClose}
              className={styles.cancelButton}
              disabled={isCreating}
            >
              {t('entityPage.popup.createBranch.cancelButtonText')}
            </button>
            <button
              onClick={handleCreateBranch}
              className={styles.submitButton}
              disabled={!newBranchName.trim() || isCreating}
            >
              {isCreating ? `${t('entityPage.popup.createBranch.loadingText')}` : `${t('entityPage.popup.createBranch.submitButtonText')}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EntityCreateBranchPopup;