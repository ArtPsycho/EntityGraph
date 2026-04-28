import React, {useEffect, useState} from "react";
import styles from './note-preview.module.css';
import {DefaultCloseIcon} from "../../../../../../assets/images/icons/close_icon";
import MarkdownRenderer from "../../../../../ui/markdown/markdown-renderer/markdown-renderer";
import {DefaultEditPencilIcon} from "../../../../../../assets/images/icons/edit-pencil_icon";
import MarkdownEditor from "../../../../../ui/markdown/markdown-editor/markdown-editor";
import EntityDeleteNotePopup from "../../../popup/entity-delete-note-popup/entity-delete-note-popup";
import {useTranslation} from "react-i18next";

interface NotePreviewProps {
  active: boolean;
  onClose: () => void;
  title: string;
  content: string;
  updatedAt: string;
  createdAt: string;
  onUpdate: (title: string, content: string) => void;
  onDelete: () => void;
}

const NotePreview: React.FC<NotePreviewProps> = ({
  active,
  onClose,
  title,
  content,
  updatedAt,
  createdAt,
  onUpdate,
  onDelete
}) => {
  if (!active) return null;

  const [isEditActive, setIsEditActive] = useState<boolean>(false);
  const [titleValue, setTitleValue] = useState<string>(title);
  const [markdownValue, setMarkdownValue] = useState<string>(content);
  const [isDeletePopupActive, setIsDeletePopupActive] = useState<boolean>(false);

  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (i18n.language) {
    }
  }, [i18n.language]);

  return (
    <div className={styles.overlay}>
      {isEditActive ? (
        <>
        <div className={styles.modalSection}>
          <div className={styles.modalHeader}>
            <button
              className={styles.closeButton}
              onClick={() => {
                setIsEditActive(false)
                setMarkdownValue(content)
              }}
            >
              <DefaultCloseIcon width="32px" height="32px" />
            </button>
            <div className={styles.mergeContainerHorizontal}>
              <button
                className={styles.deleteButton}
                onClick={() => setIsDeletePopupActive(true)}
              >
                {t('entityPage.content.notes.content.deleteButtonText')}
              </button>
              <button
                className={styles.submitButton}
                onClick={() => {
                  onUpdate(titleValue, markdownValue)
                  setIsEditActive(false)
                  setMarkdownValue(content)
                  setTitleValue(title)
                }}
              >
                {t('entityPage.content.notes.content.submitButtonText')}
              </button>
            </div>

          </div>
          <div className={styles.titleInput}>
            <input
              className={styles.input}
              placeholder={t('entityPage.content.notes.content.titleInputPlaceholder')}
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
            />
          </div>

          <MarkdownEditor
            value={markdownValue}
            onChange={(e) => setMarkdownValue(e.target.value)}
          />
        </div>
        <div className={styles.modalSection}>
          <div className={styles.sectionPreview}>
            <MarkdownRenderer content={markdownValue} />
          </div>
        </div>
        </>
      ) : (
        <div className={styles.modalSection}>
          <div className={styles.modalHeader}>
            <div className={styles.mergeContainerHorizontal}>
              <h2 className={styles.title}>{title}</h2>
              <button
                className={styles.editButton}
                onClick={() => setIsEditActive(true)}
              >
                <DefaultEditPencilIcon width="24px" height="24px" />
              </button>
            </div>

            <button
              className={styles.closeButton}
              onClick={onClose}
            >
              <DefaultCloseIcon width="32px" height="32px" />
            </button>
          </div>
          <div className={styles.noteInfo}>
            <p>{t('entityPage.content.notes.content.createdLabel')}: {new Date(createdAt).toLocaleString()}</p>
            <p>{t('entityPage.content.notes.content.updatedLabel')}: {new Date(updatedAt).toLocaleString()}</p>
          </div>

          <div className={styles.content}>
            <MarkdownRenderer
              content={content}
            />
          </div>

        </div>
      )}

      <EntityDeleteNotePopup
        active={isDeletePopupActive}
        onClose={() => setIsDeletePopupActive(false)}
        onConfirm={onDelete}
        itemName={title}
        itemType={t('entityPage.popup.deleteNote.itemType')}
      />
    </div>
  );
}

export default NotePreview;