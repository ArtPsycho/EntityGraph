import React from "react";
import styles from "./home-updates-popup.module.css";
import MarkdownRenderer from "../../../../ui/markdown/markdown-renderer/markdown-renderer";
import updateList from './updates.json';
import {DefaultCloseIcon} from "../../../../../assets/images/icons/close_icon";

interface PopupProps {
  active: boolean;
  onClose: () => void;
}

type UpdateData = {
  updates: {
    [version: string]: string;
  };
};

type UpdateItem = {
  version: string;
  content: string;
};

const HomeUpdatesPopup: React.FC<PopupProps> = ({ active, onClose }) => {
  if (!active) return null;

  const [updates, setUpdates] = React.useState<UpdateItem[]>([]);

  React.useEffect(() => {
    const updatesArray = Object.entries(updateList.updates).map(
      ([version, content]) => ({
        version,
        content: content as string,
      })
    );

    updatesArray.sort((a, b) => {
      const versionA = a.version.split('.').map(Number);
      const versionB = b.version.split('.').map(Number);
      for (let i = 0; i < Math.max(versionA.length, versionB.length); i++) {
        const numA = versionA[i] || 0;
        const numB = versionB[i] || 0;
        if (numA !== numB) return numB - numA;
      }
      return 0;
    });
    setUpdates(updatesArray);
  }, []);

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.popupHeader}>
          <h2 className={styles.title}>Updates history</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
          >
            <DefaultCloseIcon width="32px" height="32px" />
          </button>
        </div>

        <div className={styles.updatesList}>
          {updates.map((update) => (
            <div key={update.version} className={styles.updateItem}>
              <div className={styles.updateContent}>
                <MarkdownRenderer content={update.content} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeUpdatesPopup;