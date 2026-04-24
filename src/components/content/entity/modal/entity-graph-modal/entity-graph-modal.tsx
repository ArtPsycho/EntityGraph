import React, { useEffect, useState, useRef, useCallback } from "react";
import styles from './entity-graph-modal.module.css';
import { DefaultCloseIcon } from "../../../../../assets/images/icons/close_icon";
import Tree from 'react-d3-tree';
import {DefaultGraphIcon} from "../../../../../assets/images/icons/graph_icon";
import {DefaultCommitIcon} from "../../../../../assets/images/icons/commit_icon";
import {DefaultBranchIcon} from "../../../../../assets/images/icons/branch_icon";
import {DefaultRefreshIcon} from "../../../../../assets/images/icons/refresh_icon";
import {DefaultMouseIcon} from "../../../../../assets/images/icons/mouse_icon";
import {useTranslation} from "react-i18next";

interface ModalProps {
  active: boolean;
  onClose: () => void;
  fileData: any;
}

interface TreeNode {
  name: string;
  attributes?: {
    type: string;
    status?: string;
    progress?: number;
    pointsCount?: number;
    subBranchesCount?: number;
    date?: string;
  };
  children?: TreeNode[];
}

const EntityGraphModal: React.FC<ModalProps> = ({
  active,
  onClose,
  fileData
}) => {
  const [treeData, setTreeData] = useState<TreeNode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  if (!active || !fileData) return null;

  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (i18n.language) {
    }
  }, [i18n.language]);


  const calculateTotalProgress = (data: any): number => {
    let totalPoints = 0;
    let completedPoints = 0;

    data.branches?.forEach((branch: any) => {
      branch.points?.forEach((point: any) => {
        totalPoints++;
        if (point.status === 'done') completedPoints++;
      });
    });

    return totalPoints === 0 ? 0 : Math.round((completedPoints / totalPoints) * 100);
  };

  const getBranchStatus = (branch: any): string => {
    if (!branch.points || branch.points.length === 0) return 'empty';
    const allDone = branch.points.every((p: any) => p.status === 'done');
    const someInProgress = branch.points.some((p: any) => p.status === 'in_progress');
    if (allDone) return 'completed';
    if (someInProgress) return 'in_progress';
    return 'pending';
  };

  const convertToTreeFormat = (data: any): TreeNode => {
    const root: TreeNode = {
      name: data.name,
      attributes: {
        type: 'Entity',
        progress: calculateTotalProgress(data),
      },
      children: []
    };

    if (data.branches && data.branches.length > 0) {
      root.children = data.branches.map((branch: any) => ({
        name: branch.name,
        attributes: {
          type: 'Branch',
          pointsCount: branch.points?.length || 0,
          status: getBranchStatus(branch),
        },
        children: branch.points?.map((point: any) => ({
          name: point.name,
          attributes: {
            type: 'Point',
            status: point.status,
            date: point.toDoUntil ? new Date(point.toDoUntil).toLocaleDateString() : undefined,
            subBranchesCount: point.subBranches?.length || 0,
          },
          children: point.subBranches?.map((subBranch: any) => ({
            name: subBranch.name,
            attributes: {
              type: 'Subbranch',
              status: subBranch.status,
              date: subBranch.toDoUntil ? new Date(subBranch.toDoUntil).toLocaleDateString() : undefined,
            },
            children: []
          }))
        }))
      }));
    }

    return root;
  };

  const updateDimensionsAndCenter = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const newDimensions = {
        width: rect.width,
        height: rect.height,
      };
      setDimensions(newDimensions);
      setTranslate({
        x: rect.width / 2,
        y: rect.height / 4,
      });
    }
  }, []);

  const [resetKey, setResetKey] = useState(0);

  const handleReset = useCallback(() => {
    updateDimensionsAndCenter();
    setResetKey(prev => prev + 1);
  }, [updateDimensionsAndCenter]);

  useEffect(() => {
    if (active && treeData) {
      updateDimensionsAndCenter();
      window.addEventListener('resize', updateDimensionsAndCenter);
      return () => window.removeEventListener('resize', updateDimensionsAndCenter);
    }
  }, [active, treeData, updateDimensionsAndCenter]);

  useEffect(() => {
    if (active && fileData) {
      const convertedData = convertToTreeFormat(fileData);
      setTreeData(convertedData);
    }
  }, [active, fileData]);

  const renderCustomNode = ({ nodeDatum, toggleNode }: any) => {
    const statusColors: Record<string, string> = {
      done: "var(--color-status-done)",
      in_progress: 'var(--color-status-progress)',
      pending: 'var(--color-status-pending)',
    };

    const typeLabels: Record<string, string> = {
      Entity: `${t('entityPage.modal.graph.content.entityLabel')}`,
      Branch: `${t('entityPage.modal.graph.content.branchLabel')}`,
      Point: `${t('entityPage.modal.graph.content.pointLabel')}`,
      Subbranch: `${t('entityPage.modal.graph.content.subbranchLabel')}`
    };

    const circleRadiusByType: Record<string, number> = {
      Entity: 40,
      Branch: 30,
      Point: 24,
      Subbranch: 18
    };

    const nodeType = nodeDatum.attributes?.type;
    const nodeStatus = nodeDatum.attributes?.status;

    let strokeColor = 'var(--color-border-accent)';
    let strokeWidth = 4;

    if (nodeStatus && statusColors[nodeStatus]) {
      strokeColor = statusColors[nodeStatus];
      strokeWidth = 2;
    }

    const circleRadius = circleRadiusByType[nodeType] || 15;
    const startX = circleRadius + 12;

    let statusText = '';
    const otherAttributes: string[] = [];

    if (nodeDatum.attributes) {
      Object.entries(nodeDatum.attributes)
        .filter(([key]) => key !== 'type')
        .forEach(([key, val]) => {
          if (key === 'status') {
            const statusLabels: Record<string, string> = {
              done: `${t('entityPage.modal.graph.doneStatusLabel')}`,
              in_progress: `${t('entityPage.modal.graph.inProgressStatusLabel')}`,
              pending: `${t('entityPage.modal.graph.pendingStatusLabel')}`,
            };
            statusText = statusLabels[val as string];
          } else if (key === 'progress') {
            otherAttributes.push(`${t('entityPage.modal.graph.content.graphProgressLabel')}: ${val}%`);
          } else if (key === 'pointsCount') {
            otherAttributes.push(`${val} ${t('entityPage.modal.graph.content.graphPointsLabel')}`);
          } else if (key === 'subBranchesCount') {
            otherAttributes.push(`${val} ${t('entityPage.modal.graph.content.graphSubbranchesLabel')}`);
          } else if (key === 'date') {
            otherAttributes.push(`${val || `${t('entityPage.modal.graph.content.graphTimeLimitLabel')}`}`);
          } else {
            otherAttributes.push(`${key}: ${val}`);
          }
        });
    }

    const getIcon = () => {
      switch (nodeType) {
        case 'Entity':
          return <DefaultGraphIcon width="30px" height="30px" />;
        case 'Branch':
          return <DefaultBranchIcon width="24px" height="24px" />;
        case 'Point':
          return <DefaultCommitIcon width="20px" height="20px" />;
        case 'Subbranch':
          return <DefaultGraphIcon width="16px" height="16px" />;
        default:
          return null;
      }
    };

    return (
      <g onClick={toggleNode} style={{ cursor: 'pointer' }}>

        <circle
          r={circleRadius}
          fill="var(--color-background-card)"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          style={{
            transition: 'all 0.3s ease',
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
          }}
        />

        <foreignObject x={-circleRadius + 8} y={-circleRadius + 8} width={circleRadius * 2 - 16} height={circleRadius * 2 - 16}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%'
          }}>
            {getIcon()}
          </div>
        </foreignObject>

        <foreignObject x={startX} y={-25} width="260" height="200">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            fontFamily: 'Roboto, sans-serif',
          }}>

            <div style={{
              maxWidth: '150px',
              color: 'var(--color-text-accent)',
              fontSize: '16px',
              fontWeight: 'var(--font-weight-semi-bold)',
              lineHeight: 1.3
            }}>
              {nodeDatum.name}
            </div>

            {nodeType && (
              <div style={{
                color: 'var(--color-text-secondary)',
                fontSize: '12px',
                fontStyle: 'italic',
                fontWeight: 'var(--font-weight-thin)',
                lineHeight: 1.2
              }}>
                {typeLabels[nodeType]}
              </div>
            )}

            {otherAttributes.length > 0 && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                marginTop: '2px'
              }}>
                {otherAttributes.map((attr, index) => (
                  <div
                    key={index}
                    style={{
                      color: 'var(--color-text-primary)',
                      fontSize: '12px',
                      fontWeight: 'var(--font-weight-thin)',
                      lineHeight: 1.2
                    }}
                  >
                    {attr}
                  </div>
                ))}
              </div>
            )}

            {statusText && (
              <div style={{
                color: statusColors[nodeStatus || ''],
                fontSize: '11px',
                fontWeight: 'bold',
                lineHeight: 1.2,
                marginTop: '2px'
              }}>
                {statusText}
              </div>
            )}
          </div>
        </foreignObject>
      </g>
    );
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            <h2>{fileData.name} - {t('entityPage.modal.graph.title')}</h2>
            <div className={styles.modalStats}>
              <span className={styles.stat}>
                {fileData.branches?.length || 0} {t('entityPage.modal.graph.branchesLabel')}
              </span>
              <span className={styles.stat}>
                {fileData.branches?.reduce((acc: number, b: any) => acc + (b.points?.length || 0), 0) || 0} {t('entityPage.modal.graph.pointsLabel')}
              </span>
              <span className={styles.stat}>
                {fileData.branches?.reduce((acc: number, b: any) =>
                acc + b.points?.reduce((subAcc: number, p: any) => subAcc + (p.subBranches?.length || 0), 0) || 0, 0) || 0} {t('entityPage.modal.graph.subbranchesLabel')}
              </span>
              <span className={styles.statProgress}>
                {treeData?.attributes?.progress || 0}% {t('entityPage.modal.graph.progressLabel')}
              </span>
            </div>
          </div>
          <div className={styles.modalControls}>
            <button
              className={styles.resetButton}
              onClick={handleReset}
              title={t('entityPage.modal.graph.resetButtonTitle')}
            >
              <DefaultRefreshIcon width="24px" height="24px" />
            </button>
            <button
              className={styles.closeButton}
              onClick={onClose}
              title={t('entityPage.modal.graph.closeButtonTitle')}
            >
              <DefaultCloseIcon width="24px" height="24px" />
            </button>
          </div>
        </div>

        <div className={styles.modalContent}>
          <div
            ref={containerRef}
            className={styles.treeContainer}
          >
            {treeData && (
              <Tree
                key={resetKey}
                data={treeData}
                orientation="vertical"
                pathFunc="step"
                nodeSize={{ x: 200, y: 200 }}
                separation={{
                  siblings: 1.2,
                  nonSiblings: 1.5
                }}
                enableLegacyTransitions={true}
                transitionDuration={500}
                zoomable={true}
                scaleExtent={{ min: 0.1, max: 4 }}
                collapsible={true}
                initialDepth={1}
                centeringTransitionDuration={800}
                dimensions={dimensions}
                translate={translate}
                renderCustomNodeElement={renderCustomNode}
              />
            )}
          </div>
        </div>

        <div className={styles.modalFooter}>
          <div className={styles.footerInfo}>
            <div className={styles.infoSection}>
              <div className={styles.pendingStatus}></div>
              <p className={styles.infoSectionText}>{t('entityPage.modal.graph.pendingStatusLabel')}</p>
            </div>
            <div className={styles.infoSection}>
              <div className={styles.progressStatus}></div>
              <p className={styles.infoSectionText}>{t('entityPage.modal.graph.inProgressStatusLabel')}</p>
            </div>
            <div className={styles.infoSection}>
              <div className={styles.doneStatus}></div>
              <p className={styles.infoSectionText}>{t('entityPage.modal.graph.doneStatusLabel')}</p>
            </div>
          </div>
          <div className={styles.controls}>
            <div className={styles.controlHint}>️
              <DefaultMouseIcon width="20px" height="20px" />
              {t('entityPage.modal.graph.expandCollapseLabel')}
            </div>
            <div className={styles.controlHint}>
              <DefaultMouseIcon width="20px" height="20px" />
              {t('entityPage.modal.graph.scrollDragLabel')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntityGraphModal;