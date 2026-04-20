import React, { useEffect, useState } from "react";
import styles from "./home-tutorial-popup.module.css";
import { useTranslation } from "react-i18next";

interface TutorialStep {
  id: number;
  title: string;
  mediaType: 'image' | 'video' | 'gif';
  mediaSrc: string;
  description: string;
}

const getTutorialSteps = (t: any): TutorialStep[] => [
  {
    id: 1,
    title: t('homePage.popup.tutorial.welcome.title'),
    mediaType: "image",
    mediaSrc: "/tutorial/welcome.png",
    description: t('homePage.popup.tutorial.welcome.message')
  },
  {
    id: 2,
    title: t('homePage.popup.tutorial.homePage.title'),
    mediaType: "image",
    mediaSrc: "/tutorial/homePage.png",
    description: t('homePage.popup.tutorial.homePage.message')
  },
  {
    id: 3,
    title: t('homePage.popup.tutorial.createEntity.title'),
    mediaType: "image",
    mediaSrc: "/tutorial/createEntity.png",
    description: t('homePage.popup.tutorial.createEntity.message')
  },
  {
    id: 4,
    title: t('homePage.popup.tutorial.entityPage.title'),
    mediaType: "image",
    mediaSrc: "/tutorial/entityPage.png",
    description: t('homePage.popup.tutorial.entityPage.message')
  },
  {
    id: 5,
    title: t('homePage.popup.tutorial.createBranch.title'),
    mediaType: "image",
    mediaSrc: "/tutorial/createBranch.png",
    description: t('homePage.popup.tutorial.createBranch.message')
  },
  {
    id: 6,
    title: t('homePage.popup.tutorial.branch.title'),
    mediaType: "image",
    mediaSrc: "/tutorial/branch.png",
    description: t('homePage.popup.tutorial.branch.message')
  },
  {
    id: 7,
    title: t('homePage.popup.tutorial.progress.title'),
    mediaType: "image",
    mediaSrc: "/tutorial/progress.png",
    description: t('homePage.popup.tutorial.progress.message')
  },
  {
    id: 8,
    title: t('homePage.popup.tutorial.start.title'),
    mediaType: "image",
    mediaSrc: "/tutorial/start.png",
    description: t('homePage.popup.tutorial.start.message')
  }
];

interface HomeTutorialPopupProps {
  active: boolean;
  onClose: () => void;
  onSkip: () => void;
}

const HomeTutorialPopup: React.FC<HomeTutorialPopupProps> = ({
  active,
  onClose,
  onSkip
}) => {
  const { t, i18n } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [tutorialSteps, setTutorialSteps] = useState<TutorialStep[]>(() => getTutorialSteps(t));
  const totalSteps = tutorialSteps.length;

  useEffect(() => {
    setTutorialSteps(getTutorialSteps(t));
    setCurrentStep(0);
  }, [t, i18n.language]);

  if (!active) return null;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
      setCurrentStep(0);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onSkip();
    onClose();
    setCurrentStep(0);
  };

  const currentTutorial = tutorialSteps[currentStep];

  const renderMedia = () => {
    switch (currentTutorial.mediaType) {
      case 'video':
        return (
          <video
            className={styles.media}
            controls
            autoPlay
            muted
            loop
          >
            <source src={currentTutorial.mediaSrc} type="video/mp4" />
            {t('homePage.popup.tutorial.videoNotSupported')}
          </video>
        );
      case 'gif':
        return (
          <img
            className={styles.media}
            src={currentTutorial.mediaSrc}
            alt={currentTutorial.title}
          />
        );
      case 'image':
      default:
        return (
          <img
            className={styles.media}
            src={currentTutorial.mediaSrc}
            alt={currentTutorial.title}
          />
        );
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>

        <h2 className={styles.title}>{currentTutorial.title}</h2>

        <div className={styles.mediaContainer}>
          {renderMedia()}
        </div>

        <p className={styles.description}>{currentTutorial.description}</p>

        <div className={styles.stepsIndicator}>
          {tutorialSteps.map((_, index) => (
            <div
              key={index}
              className={`${styles.stepDot} ${index === currentStep ? styles.activeStep : ''}`}
              onClick={() => setCurrentStep(index)}
            />
          ))}
        </div>

        <div className={styles.buttonsContainer}>
          <button
            className={`${styles.button} ${styles.backButton}`}
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            {t('homePage.popup.tutorial.backButtonText')}
          </button>

          <button
            className={`${styles.button} ${styles.skipButton}`}
            onClick={handleSkip}
          >
            {t('homePage.popup.tutorial.skipTutorialButtonText')}
          </button>

          <button
            className={`${styles.button} ${styles.nextButton}`}
            onClick={handleNext}
          >
            {currentStep === totalSteps - 1 ? t('homePage.popup.tutorial.finishButtonText') : t('homePage.popup.tutorial.nextButtonText')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeTutorialPopup;