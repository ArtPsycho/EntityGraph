import React, {useCallback, useEffect} from 'react';
import styles from './EntityList.module.css';
import { useNavigate } from 'react-router-dom';
import type { EntityListItem } from '../../../types/entity';
import { DefaultDeleteIcon } from "../../../assets/images/icons/delete_icon";
import {DefaultFileExportIcon} from "../../../assets/images/icons/file-export_icon";
import {DefaultGraphIcon} from "../../../assets/images/icons/graph_icon";
import {useTranslation} from "react-i18next";

interface EntityListProps {
  entities: EntityListItem[];
  onDelete: (entity: EntityListItem) => void;
  onExport: (entity: EntityListItem) => void;
}

export const EntityList: React.FC<EntityListProps> = ({ entities, onDelete, onExport }) => {
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (i18n.language) {
    }
  }, [i18n.language]);


  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  const handleCardClick = useCallback((fileName: string, event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.closest('button')) {
      return;
    }

    // Проверяем, есть ли выделенный текст
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      return;
    }

    navigate(`/entity/${fileName}`);
  }, [navigate]);

  const handleExportClick = useCallback((entity: EntityListItem, event: React.MouseEvent) => {
    event.stopPropagation();
    onExport(entity);
  }, [onExport]);

  const handleDeleteClick = useCallback((entity: EntityListItem, event: React.MouseEvent) => {
    event.stopPropagation();
    onDelete(entity);
  }, [onDelete]);

  return (
    <div className={styles.entityList}>
      {entities.length === 0 ? (
        <div className={styles.noEntities}>
          <p>{t('entity.entityList.noEntities')}</p>
          <DefaultGraphIcon width="32px" height="32px" color="#3f3f3f" />
        </div>
      ) : (
        <div className={styles.entityListGrid}>
          {entities.map((entity) => (
            <div
              key={entity.id}
              className={styles.entityCard}
              onClick={(e) => handleCardClick(entity.fileName, e)}
            >
              <div className={styles.entityMeta}>
                <small>{t('entity.entityList.createdLabel')}: {formatDate(entity.createdAt)}</small>
                <small>{t('entity.entityList.updatedLabel')}: {formatDate(entity.updatedAt)}</small>
              </div>

              <div className={styles.cardInfo}>
                <h3>{entity.name}</h3>
              </div>

              <div className={styles.entityActions}>
                <button
                  onClick={(e) => handleExportClick(entity, e)}
                  className={styles.shareButton}
                >
                  {t('entity.entityList.exportButtonText')} <DefaultFileExportIcon width="20px" height="20px" color="#fff" />
                </button>
                <button
                  onClick={(e) => handleDeleteClick(entity, e)}
                  className={styles.deleteButton}
                >
                  <DefaultDeleteIcon width="24px" height="24px" color="#fff" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};