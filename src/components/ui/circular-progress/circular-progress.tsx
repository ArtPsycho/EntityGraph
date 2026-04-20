import React from "react";
import styles from './circular-progress.module.css';

interface CircularProgressProps {
  percent: number;
  size: number;
  strokeWidth: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
 percent,
 size,
 strokeWidth
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className={styles.circularProgress}>
      <svg width={size} height={size}>

        <circle
          className={styles.circularProgressBackground}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
        />

        <circle
          className={styles.circularProgressFill}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className={styles.circularProgressText}>
        {Math.round(percent)}%
      </div>
    </div>
  );
};

export default CircularProgress;