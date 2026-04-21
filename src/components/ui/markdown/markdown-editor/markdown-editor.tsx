import React, {useEffect, useRef} from 'react';
import styles from './markdown-editor.module.css';
import {useTranslation} from "react-i18next";

interface MarkdownEditorProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  label?: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = '...',
  label
}) => {

  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (i18n.language) {
    }
  }, [i18n.language]);


  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);

    const event = {
      target: { value: newText }
    } as React.ChangeEvent<HTMLTextAreaElement>;

    onChange(event);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const insertListItem = () => {
    insertMarkdown('- ');
  };

  const insertNumberedListItem = () => {
    insertMarkdown('1. ');
  };

  const insertQuote = () => {
    insertMarkdown('> ');
  };

  const insertCodeBlock = () => {
    insertMarkdown('```\n', '\n```');
  };

  const insertLink = () => {
    insertMarkdown('[', '](url)');
  };

  const insertImage = () => {
    insertMarkdown('![alt text](', 'image-url)');
  };

  const insertHorizontalRule = () => {
    insertMarkdown('\n---\n');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        insertMarkdown('**', '**');
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault();
        insertMarkdown('*', '*');
      }
    };

    const textarea = textareaRef.current;
    textarea?.addEventListener('keydown', handleKeyDown);

    return () => {
      textarea?.removeEventListener('keydown', handleKeyDown);
    };
  }, [value]);

  return (
    <div className={styles.editorContainer}>
      {label && <label className={styles.label}>{label}</label>}

      <div className={styles.toolbar}>
        <button
          type="button"
          onClick={() => insertMarkdown('# ')}
          className={styles.toolbarButton}
          title={t('ui.markdown.editor.h1ButtonTitle')}
        >
          {t('ui.markdown.editor.h1ButtonText')}
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('## ')}
          className={styles.toolbarButton}
          title={t('ui.markdown.editor.h2ButtonTitle')}
        >
          {t('ui.markdown.editor.h2ButtonText')}
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('### ')}
          className={styles.toolbarButton}
          title={t('ui.markdown.editor.h3ButtonTitle')}
        >
          {t('ui.markdown.editor.h3ButtonText')}
        </button>

        <button
          type="button"
          onClick={() => insertMarkdown('**', '**')}
          className={styles.toolbarButton}
          title={t('ui.markdown.editor.boldButtonTitle')}
        >
          <strong>{t('ui.markdown.editor.boldButtonText')}</strong>
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('*', '*')}
          className={styles.toolbarButton}
          title={t('ui.markdown.editor.italicButtonTitle')}
        >
          <em>{t('ui.markdown.editor.italicButtonText')}</em>
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('`', '`')}
          className={styles.toolbarButton}
          title={t('ui.markdown.editor.inlineCodeButtonTitle')}
        >
          {t('ui.markdown.editor.inlineCodeButtonText')}
        </button>

        <button
          type="button"
          onClick={insertListItem}
          className={styles.toolbarButton}
          title={t('ui.markdown.editor.unorderedListButtonTitle')}
        >
          {t('ui.markdown.editor.unorderedListButtonText')}
        </button>
        <button
          type="button"
          onClick={insertNumberedListItem}
          className={styles.toolbarButton}
          title={t('ui.markdown.editor.orderedListButtonTitle')}
        >
          {t('ui.markdown.editor.orderedListButtonText')}
        </button>

        <button
          type="button"
          onClick={insertQuote}
          className={styles.toolbarButton}
          title={t('ui.markdown.editor.quoteButtonTitle')}
        >
          {t('ui.markdown.editor.quoteButtonText')}
        </button>
        <button
          type="button"
          onClick={insertCodeBlock}
          className={styles.toolbarButton}
          title={t('ui.markdown.editor.blockCodeButtonTitle')}
        >
          {t('ui.markdown.editor.blockCodeButtonText')}
        </button>

        <button
          type="button"
          onClick={insertLink}
          className={styles.toolbarButton}
          title={t('ui.markdown.editor.linkButtonTitle')}
        >
          {t('ui.markdown.editor.linkButtonText')}
        </button>
        <button
          type="button"
          onClick={insertImage}
          className={styles.toolbarButton}
          title={t('ui.markdown.editor.imageButtonTitle')}
        >
          {t('ui.markdown.editor.imageButtonText')}
        </button>
        <button
          type="button"
          onClick={insertHorizontalRule}
          className={styles.toolbarButton}
          title={t('ui.markdown.editor.horizontalLineButtonTitle')}
        >
          {t('ui.markdown.editor.horizontalLineButtonText')}
        </button>
      </div>

      <textarea
        ref={textareaRef}
        className={styles.textarea}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default MarkdownEditor;