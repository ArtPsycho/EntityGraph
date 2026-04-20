import React, {useEffect, useRef} from "react";
import styles from "./entity-change-point-status-popup.module.css";
import {useTranslation} from "react-i18next";

interface PopupProps {
  active: boolean;
  onClose: () => void;
  onSelectStatus: (status: 'pending' | 'in_progress' | 'done') => void;
  currentStatus: string;
}

const EntityChangePointStatusPopup: React.FC<PopupProps> = ({ active, onClose, onSelectStatus, currentStatus }) => {
  if(!active) return null;

  const popupRef = useRef<HTMLDivElement>(null);

  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (i18n.language) {
    }
  }, [i18n.language]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (active) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [active, onClose]);

  const statuses = [
    { value: 'pending', label: `${t('entityPage.popup.status.pending')}`, className: styles.pending },
    { value: 'in_progress', label: `${t('entityPage.popup.status.inProgress')}`, className: styles.inProgress },
    { value: 'done', label: `${t('entityPage.popup.status.done')}`, className: styles.done }
  ];

  return (

    <>
      <div className={styles.popup} ref={popupRef}>
        {statuses.map(status => (
          <div className={`${styles.option} ${status.className} ${currentStatus === status.value ? styles.active : ''}`}>
            <button
              key={status.value}
              className={`${styles.statusOption} ${status.className} ${currentStatus === status.value ? styles.active : ''}`}
              onClick={() => {
                onSelectStatus(status.value as any);
                onClose();
              }}
            >
              {status.label}

            </button>
            {currentStatus === status.value && (
              <>✓</>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default EntityChangePointStatusPopup;