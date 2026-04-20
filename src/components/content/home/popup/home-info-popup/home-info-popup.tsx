import React, {useEffect} from "react";
import styles from "./home-info-popup.module.css";
import {DefaultCloseIcon} from "../../../../../assets/images/icons/close_icon";
import {useTranslation} from "react-i18next";

interface PopupProps {
  active: boolean;
  onClose: () => void;
}

const HomeInfoPopup: React.FC<PopupProps> = ({ active, onClose }) => {
  if(!active) return null;

  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (i18n.language) {
    }
  }, [i18n.language]);

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.popupHeader}>
          <button
            className={styles.closePopupButton}
            onClick={onClose}
          >
            <DefaultCloseIcon width="24px" height="24px" />
          </button>
        </div>
        <div className={styles.popupText}>
          <h2 className={styles.title}>{t('homePage.popup.info.title')}</h2>
          <p className={styles.text}>
            {t('homePage.popup.info.paragraphOne')}
          </p>
          <p className={styles.text}>
            {t('homePage.popup.info.paragraphTwo')}
          </p>
          <p className={styles.text}>
            {t('homePage.popup.info.paragraphThree')}
          </p>
        </div>
      </div>
    </div>
  )
}

export default HomeInfoPopup;