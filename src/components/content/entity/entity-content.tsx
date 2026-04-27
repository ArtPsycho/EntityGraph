import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import styles from './entity-content.module.css';
import {exportData, loadEntity} from '../../../services/storage';
import {Entity, EntityListItem, Point, SubBranch} from '../../../types/entity';
import {
  addBranch,
  addPointToBranch, addSubBranchToPoint,
  deleteBranch,
  deletePoint, deleteSubBranchFromPoint, getAllEntities, getEntity, removeEntity, reorderBranches, reorderPoints,
  reorderSubBranches,
  updateBranch, updateEntity, updateEntityName,
  updatePoint, updateSubBranchInPoint
} from "../../../services/entityManager";
import EntityCreateBranchPopup from "./popup/entity-create-branch-popup/entity-create-branch-popup";
import EntityDeleteBranchPopup from "./popup/entity-delete-branch-popup/entity-delete-branch-popup";
import {DefaultDeleteIcon} from "../../../assets/images/icons/delete_icon";
import EntityChangePointStatusPopup from "./popup/entity-change-point-status-popup/entity-change-point-status-popup";
import Tooltip from "../../ui/tooltip/tooltip";
import CircularProgress from "../../ui/circular-progress/circular-progress";
import {DefaultEditIcon} from "../../../assets/images/icons/edit_icon";
import {DefaultCloseIcon} from "../../../assets/images/icons/close_icon";
import {DefaultSuccessIcon} from "../../../assets/images/icons/success_icon";
import {DefaultEditPencilIcon} from "../../../assets/images/icons/edit-pencil_icon";
import EntityDeletePointPopup from "./popup/entity-delete-point-popup/entity-delete-point-popup";
import EntityDeleteSubBranchPopup from "./popup/entity-delete-subbranch-popup/entity-delete-subbranch-popup";
import {DefaultShareIcon} from "../../../assets/images/icons/share_icon";
import {DefaultFileExportIcon} from "../../../assets/images/icons/file-export_icon";
import {DefaultArrowBackIcon} from "../../../assets/images/icons/arrow-back_icon";
import EntityDeleteEntityPopup from "./popup/entity-delete-entity-popup/entity-delete-entity-popup";
import {useTheme} from "../../../hooks/useTheme";
import {DefaultGraphIcon} from "../../../assets/images/icons/graph_icon";
import {DefaultCommitIcon} from "../../../assets/images/icons/commit_icon";
import {useTranslation} from "react-i18next";
import MarkdownRenderer from "../../ui/markdown/markdown-renderer/markdown-renderer";
import MarkdownEditor from "../../ui/markdown/markdown-editor/markdown-editor";
import {DefaultLeftArrowIcon} from "../../../assets/images/icons/left-arrow_icon";
import {DefaultRightArrowIcon} from "../../../assets/images/icons/right-arrow_icon";
import {DefaultArrowUpwardIcon} from "../../../assets/images/icons/arrow-upward_icon";
import {DefaultArrowDownwardIcon} from "../../../assets/images/icons/arrow-downward_icon";
import EntityGraphModal from "./modal/entity-graph-modal/entity-graph-modal";

const EntityContent = () => {
  const { fileName } = useParams<{ fileName: string }>();
  const [fileData, setFileData] = useState<Entity | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFileCorrupted, setIsFileCorrupted] = useState<boolean>(false);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);

  const [isCreateBranchPopupOpen, setIsCreateBranchPopupOpen] = useState<boolean>(false);
  const [isDeleteBranchPopupOpen, setIsDeleteBranchPopupOpen] = useState<boolean>(false);
  const [branchToDelete, setBranchToDelete] = useState<{ id: string; name: string } | null>(null);

  const [isStatusPopupOpen, setIsStatusPopupOpen] = useState<boolean>(false);
  const [activeGraphPointId, setActiveGraphPointId] = useState<string | null>(null);

  const [activeBranchId, setActiveBranchId] = useState<string | null>(null);
  const [branchName, setBranchName] = useState('');

  const [activePointId, setActivePointId] = useState<string | null>(null);
  const [pointName, setPointName] = useState('');
  const [pointDescription, setPointDescription] = useState('');
  const [pointToUntilDate, setPointToUntilDate] = useState('');
  const [isDeletePointPopupOpen, setIsDeletePointPopupOpen] = useState<boolean>(false);
  const [pointToDelete, setPointToDelete] = useState<{ branchId: string; pointId: string; name: string } | null>(null);

  const [activePointSubbranchesId, setActivePointSubbranchesId] = useState<string | null>(null);
  const [isSubbranchActive, setIsSubbranchActive] = useState<boolean>(false);
  const [activeSubbranchId, setActiveSubbranchId] = useState<string | null>(null);

  const [subBranchName, setSubBranchName] = useState('');
  const [subBranchDescription, setSubBranchDescription] = useState('');
  const [subBranchToUntilDate, setSubBranchToUntilDate] = useState('');
  const [isDeleteSubbranchPopupOpen, setIsDeleteSubbranchPopupOpen] = useState<boolean>(false);
  const [subBranchToDelete, setSubBranchToDelete] = useState<{ branchId: string; pointId: string; subBranchId: string; name: string } | null>(null);
  const [isSubbranchStatusPopupOpen, setIsSubbranchStatusPopupOpen] = useState<boolean>(false);
  const [activeSubbranchStatusId, setActiveSubbranchStatusId] = useState<string | null>(null);

  const [entityName, setEntityName] = useState('');
  const [activeEntityEdit, setActiveEntityEdit] = useState<boolean>(false);
  const [isDeleteEntityPopupOpen, setIsDeleteEntityPopupOpen] = useState<boolean>(false);

  const [isGraphModalOpen, setIsGraphModalOpen] = useState<boolean>(false);

  const navigate = useNavigate();
  const { currentTheme } = useTheme();

  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (i18n.language) {
    }
  }, [i18n.language]);


  React.useEffect(() => {
    if (fileName) {
      loadEntityData(fileName);
    }
  }, [fileName]);

  const loadEntityData = async (name: string) => {
    setLoading(true);
    setError(null);
    setIsFileCorrupted(false);
    setIsNotFound(false);

    try {
      const data = await loadEntity(name);
      if (data) {
        setFileData(data);
      } else {
        setIsNotFound(true);
        setError(`${t('entityPage.content.error.notFound')}`);
      }
    } catch (err) {
      if (err instanceof SyntaxError || (err as any)?.message?.includes('JSON')) {
        setIsFileCorrupted(true);
        setError(`${t('entityPage.content.error.fileCorrupted')}`);
      } else {
        setError(`${t('entityPage.content.error.loadingError')}`);
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBranch = async (branchName: string) => {
    if (fileData) {
      const updatedEntity = await addBranch(fileData, branchName);
      setFileData(updatedEntity);
    }
  };

  const handleDeleteBranch = async (branchId: string) => {
    if (fileData) {
      const updatedEntity = await deleteBranch(fileData, branchId);
      setFileData(updatedEntity);
      setIsDeleteBranchPopupOpen(false);
      setBranchToDelete(null);
    }
  };

  const openDeleteConfirmation = (branchId: string, branchName: string) => {
    setBranchToDelete({ id: branchId, name: branchName });
    setIsDeleteBranchPopupOpen(true);
  };

  const handleCreatePoint = async (branchId: string) => {
    if (fileData) {
      const defaultPointData: Omit<Point, 'id' | 'createdAt'> = {
        name: `${t('entityPage.content.main.pointContent.defaultNewPointName')}`,
        description: '',
        status: 'pending',
        toDoUntil: '',
        subBranches: [],
      };

      const updatedEntity = await addPointToBranch(fileData, branchId, defaultPointData);
      console.log('Updated entity:', updatedEntity);
      console.log('Points after update:', updatedEntity.branches.find(b => b.id === branchId)?.points);

      setFileData(updatedEntity);
    }
  }

  const handleDeletePoint = async (branchId: string, pointId: string) => {
    if (fileData) {
      const updatedEntity = await deletePoint(fileData, branchId, pointId);
      setFileData(updatedEntity);
      setIsDeletePointPopupOpen(false);
      setPointToDelete(null);
    }
  };


  const handleCreateSubBranch = async (branchId: string, pointId: string) => {
    if (fileData) {
      const defaultSubBranchData: Omit<SubBranch, 'id' | 'createdAt'> = {
        name: `${t('entityPage.content.main.subbranchContent.defaultNewSubbranchName')}`,
        description: '',
        status: 'pending',
        toDoUntil: ''
      };

      const updatedEntity = await addSubBranchToPoint(fileData, branchId, pointId, defaultSubBranchData);
      console.log('Updated entity:', updatedEntity);

      setFileData(updatedEntity);
    }
  }

  const handleUpdateSubBranchStatus = async (
    branchId: string,
    pointId: string,
    subBranchId: string,
    newStatus: 'pending' | 'in_progress' | 'done'
  ) => {
    if (fileData) {
      const updatedEntity = await updateSubBranchInPoint(fileData, branchId, pointId, subBranchId, {
        status: newStatus
      });
      setFileData(updatedEntity);
    }
  };

  const handleDeleteSubBranch = async (branchId: string, pointId: string, subBranchId: string) => {
    if (fileData) {
      const updatedEntity = await deleteSubBranchFromPoint(fileData, branchId, pointId, subBranchId);
      setFileData(updatedEntity);
      setIsDeleteSubbranchPopupOpen(false);
      setSubBranchToDelete(null);
    }
  };


  if (loading) {
    return (
      <div className={styles.content}>
        <div className={styles.loading}>
          {t('entityPage.content.loading.message')}
        </div>
      </div>
    );
  }

  if (isNotFound) {
    return (
      <div className={styles.content}>
        <div className={styles.errorContainer}>
          <h3>{t('entityPage.content.notFound.title')}</h3>
          <p>{t('entityPage.content.notFound.message')}</p>
          <button
            onClick={() => navigate('/home')}
            className={styles.homeButton}
          >
            {t('entityPage.content.notFound.homeButtonText')}
          </button>
        </div>
      </div>
    );
  }

  if (isFileCorrupted) {
    return (
      <div className={styles.content}>
        <div className={styles.errorContainer}>
          <h3>{t('entityPage.content.fileCorrupted.title')}</h3>
          <p>{t('entityPage.content.fileCorrupted.message')}</p>
          <p className={styles.fileName}>{t('entityPage.content.fileCorrupted.fileNameLabel')}: {fileName}</p>
          <button
            onClick={() => navigate('/home')}
            className={styles.homeButton}
          >
            {t('entityPage.content.fileCorrupted.homeButtonText')}
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.content}>
        <div className={styles.errorContainer}>
          <h3>{t('entityPage.content.error.title')}</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!fileData) {
    return <div className={styles.content}>{t('entityPage.content.noData.message')}</div>;
  }

  type PointStatus = 'pending' | 'in_progress' | 'done';

  const formatStatus = (status: PointStatus) => {
    const statusMap: Record<PointStatus, string> = {
      pending: `${t('entityPage.content.status.pending')}`,
      in_progress: `${t('entityPage.content.status.inProgress')}`,
      done: `${t('entityPage.content.status.done')}`
    };
    return statusMap[status] || status;
  };

  const handleUpdatePointStatus = async (
    branchId: string,
    pointId: string,
    newStatus: 'pending' | 'in_progress' | 'done'
  ) => {
    if (fileData) {
      const updatedEntity = await updatePoint(fileData, branchId, pointId, {
        status: newStatus
      });
      setFileData(updatedEntity);
    }
  };

  const calculateBranchPercent = (points: Point[]) => {
    if (points.length === 0) return 0;

    const count = points.filter(point => point.status === 'done').length;
    const result = (count / points.length) * 100;

    return Math.round(result);
  };

  const calculateSubBranchPercent = (subBranches: SubBranch[]) => {
    if (subBranches.length === 0) return 0;

    const count = subBranches.filter(subBranch => subBranch.status === 'done').length;
    const result = (count / subBranches.length) * 100;

    return Math.round(result);
  }

  const handleExportEntity = async (entity: EntityListItem): Promise<void> => {
    const fullEntity = await getEntity(entity.fileName);
    if (fullEntity) {
      await exportData(fullEntity, `${entity.name}.json`);
    }
  };

  const handleDeleteEntity = async (entityId: string): Promise<void> => {
      const allEntities = await getAllEntities();

      const entity = await allEntities.find(e => e.id === entityId);
      if (entity) {
        await removeEntity(entity.fileName);
        navigate('/home');
      }
  };



  const getNearestTasks = () => {
    if (!fileData) return [];

    const tasks: Array<{
      id: string;
      name: string;
      description: string;
      toDoUntil: string;
      status: 'pending' | 'in_progress' | 'done';
      type: 'point' | 'subbranch';
      branchName: string;
      pointName?: string;
    }> = [];

    fileData.branches.forEach(branch => {
      branch.points.forEach(point => {
        if (point.toDoUntil && point.status !== 'done') {
          tasks.push({
            id: point.id,
            name: point.name,
            description: point.description,
            toDoUntil: point.toDoUntil,
            status: point.status,
            type: 'point',
            branchName: branch.name,
          });
        }

        point.subBranches.forEach(subBranch => {
          if (subBranch.toDoUntil && subBranch.status !== 'done') {
            tasks.push({
              id: subBranch.id,
              name: subBranch.name,
              description: subBranch.description,
              toDoUntil: subBranch.toDoUntil,
              status: subBranch.status,
              type: 'subbranch',
              branchName: branch.name,
              pointName: point.name,
            });
          }
        });
      });
    });

    return tasks
      .sort((a, b) => {
        const dateA = new Date(a.toDoUntil);
        const dateB = new Date(b.toDoUntil);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 10);
  };

  const formatTaskDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    // Обнуляем время для корректного сравнения дат
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const taskDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const diffTime = taskDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `${t('entityPage.content.taskDate.overdue')} ${Math.abs(diffDays)}${t('entityPage.content.taskDate.overdueDays')}`;
    if (diffDays === 0) return `${t('entityPage.content.taskDate.today')}`;
    if (diffDays === 1) return `${t('entityPage.content.taskDate.tomorrow')}`;
    return null;
  };

  const getTaskStatusClass = (status: string) => {
    switch (status) {
      case 'pending': return styles.taskStatusPending;
      case 'in_progress': return styles.taskStatusInProgress;
      case 'done': return styles.taskStatusDone;
      default: return '';
    }
  };

  const getTaskTypeIcon = (type: 'point' | 'subbranch') => {
    switch (type) {
      case 'point':
        return <DefaultCommitIcon width="18px" height="18px" />;
      case 'subbranch':
        return <DefaultGraphIcon width="18px" height="18px" />;
      default:
        return null;
    }
  };


  const moveBranchUp = async (index: number) => {
    if (fileData && index > 0) {
      const updatedEntity = await reorderBranches(fileData, index, index - 1);
      setFileData(updatedEntity);
    }
  };

  const moveBranchDown = async (index: number) => {
    if (fileData && index < fileData.branches.length - 1) {
      const updatedEntity = await reorderBranches(fileData, index, index + 1);
      setFileData(updatedEntity);
    }
  };

  const movePointUp = async (branchId: string, pointIndex: number) => {
    if (fileData && pointIndex > 0) {
      const updatedEntity = await reorderPoints(fileData, branchId, pointIndex, pointIndex - 1);
      setFileData(updatedEntity);
    }
  };

  const movePointDown = async (branchId: string, pointIndex: number, totalPoints: number) => {
    if (fileData && pointIndex < totalPoints - 1) {
      const updatedEntity = await reorderPoints(fileData, branchId, pointIndex, pointIndex + 1);
      setFileData(updatedEntity);
    }
  };

  const moveSubBranchUp = async (branchId: string, pointId: string, subBranchIndex: number) => {
    if (fileData && subBranchIndex > 0) {
      const updatedEntity = await reorderSubBranches(fileData, branchId, pointId, subBranchIndex, subBranchIndex - 1);
      setFileData(updatedEntity);
    }
  };

  const moveSubBranchDown = async (branchId: string, pointId: string, subBranchIndex: number, totalSubBranches: number) => {
    if (fileData && subBranchIndex < totalSubBranches - 1) {
      const updatedEntity = await reorderSubBranches(fileData, branchId, pointId, subBranchIndex, subBranchIndex + 1);
      setFileData(updatedEntity);
    }
  };


  return (
    <div className={styles.content}>

      <div className={styles.infoBar}>
        <button
          onClick={() => navigate('/home')}
          className={styles.homeButton}
        >
          <DefaultArrowBackIcon width="20px" height="20px" color="#fff" />
          {t('entityPage.content.infoBar.goBackButtonText')}
        </button>

        {activeEntityEdit ? (
          <div className={styles.entityEditBox}>
            <div className={styles.entityEditBoxConfirmation}>
              <button
                className={styles.cancelEntityEditButton}
                title={t('entityPage.content.infoBar.editEntity.cancelButtonTitle')}
                onClick={() => {
                  setActiveEntityEdit(false);
                  setEntityName('');
                }}
              >
                <DefaultCloseIcon width="24px" height="24px" color="#fff" />
              </button>
              <button
                className={styles.confirmEntityEditButton}
                title={t('entityPage.content.infoBar.editEntity.submitButtonTitle')}
                onClick={async () => {
                  if (fileData) {
                    const updatedEntity = await updateEntityName(fileData, entityName);
                    setFileData(updatedEntity);
                    setActiveEntityEdit(false);
                    setEntityName('');
                  }
                }}
              >
                <DefaultSuccessIcon width="24px" height="24px" color="#fff" />
              </button>
            </div>

            <div className={styles.entityEditInputBox}>
              <label className={styles.entityEditInputBoxLabel}>{t('entityPage.content.infoBar.editEntity.inputNameLabel')}</label>
              <textarea
                className={styles.entityEditInput}
                placeholder={t('entityPage.content.infoBar.editEntity.inputNamePlaceholder')}
                value={entityName}
                onChange={(e) => setEntityName(e.target.value)}
              />
            </div>
          </div>
          ) : (
          <>
            <div className={styles.entityHeader}>
              <h2 className={styles.infoBarTitle}>{fileData.name}</h2>
              <button
                className={styles.editPointButton}
                onClick={() => {
                  setEntityName(fileData.name)
                  setActiveEntityEdit(true)
                }}
              >
                <DefaultEditPencilIcon width="20px" height="20px" color="#fff" />
              </button>
            </div>

            <div className={styles.infoBarMeta}>
              <p>{t('entityPage.content.infoBar.entityHeader.createdLabel')}: {new Date(fileData.createdAt).toLocaleString()}</p>
              <p>{t('entityPage.content.infoBar.entityHeader.updatedLabel')}: {new Date(fileData.updatedAt).toLocaleString()}</p>
              <p>{t('entityPage.content.infoBar.entityHeader.branchesLabel')}: {fileData.branches.length}</p>
            </div>
          </>
        )}

        <div className={styles.infoBarTasks}>
          <h3 className={styles.infoBarContentTitle}>{t('entityPage.content.infoBar.tasks.title')}</h3>
          <div className={styles.infoBarTasksList}>
            {(() => {
              const nearestTasks = getNearestTasks();
              if (nearestTasks.length === 0) {
                return <div className={styles.noTasks}>{t('entityPage.content.infoBar.tasks.noTasks')}</div>;
              }
              return (
                <div className={styles.tasksList}>
                  {nearestTasks.map(task => (
                    <div key={`${task.type}-${task.id}`} className={styles.taskItem}>
                      {/*<div className={styles.taskHeader}>*/}
                        <div className={styles.taskTitle}>
                          {/*<span className={`${styles.taskStatusDot} ${getTaskStatusClass(task.status)}`} />*/}
                          <span className={styles.taskTypeIcon}>
                            {getTaskTypeIcon(task.type)}
                          </span>
                          <span className={styles.taskName}>{task.name}</span>
                        </div>
                        <span className={styles.taskDate}>
                          {formatTaskDate(task.toDoUntil)}
                        </span>
                      {/*</div>*/}

                      {/*<div className={styles.taskLocation}>*/}
                      {/*  <span className={styles.locationIcon}>📁</span>*/}
                      {/*  <span className={styles.locationText}>{task.branchName}</span>*/}
                      {/*  {task.type === 'subbranch' && task.pointName && (*/}
                      {/*    <>*/}
                      {/*      <span className={styles.separator}>›</span>*/}
                      {/*      <span className={styles.locationIcon}>📍</span>*/}
                      {/*      <span className={styles.locationText}>{task.pointName}</span>*/}
                      {/*    </>*/}
                      {/*  )}*/}
                      {/*</div>*/}

                      {/*{task.description && (*/}
                      {/*  <p className={styles.taskDescription}>*/}
                      {/*    {task.description.length > 60*/}
                      {/*      ? `${task.description.substring(0, 60)}...`*/}
                      {/*      : task.description}*/}
                      {/*  </p>*/}
                      {/*)}*/}

                      <div className={styles.taskDeadline}>
                        {/*<span className={styles.deadlineIcon}>⏰</span>*/}
                        {/*<span className={styles.deadlineText}>*/}
                          {new Date(task.toDoUntil).toLocaleString()}
                        {/*</span>*/}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>

        <div className={styles.infoBarContent}>
          <h3 className={styles.infoBarContentTitle}>{t('entityPage.content.infoBar.progress.title')}</h3>
          <div className={styles.infoBarContentBranchList}>
            {fileData.branches.map((branch) => (
              <div key={branch.id} className={styles.infoBarContentBranch}>
                <div className={styles.infoBarContentBranchInfo}>
                  <h4 className={styles.infoBarContentBranchName}>{branch.name}</h4>
                  <CircularProgress
                    percent={calculateBranchPercent(branch.points)}
                    size={48}
                    strokeWidth={4}
                  ></CircularProgress>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>


      <div className={styles.mainBox}>

        <div className={styles.interactionBox}>
          <div className={styles.interactionBoxGraph}>
            <button
              className={styles.addBranchButton}
              onClick={() => setIsCreateBranchPopupOpen(true)}
            >
              {t('entityPage.content.main.interaction.newBranchButtonText')}
            </button>

            <button
              className={styles.exportEntityButton}
              onClick={() => setIsGraphModalOpen(true)}
            >
              <DefaultGraphIcon width="20px" height="20px" color="#fff" />
              {t('entityPage.content.main.interaction.viewGraphButtonText')}
            </button>
          </div>

          <div className={styles.interactionBoxEntity}>
            <button
              className={styles.exportEntityButton}
              onClick={() => setIsDeleteEntityPopupOpen(true)}
            >
              {t('entityPage.content.main.interaction.deleteEntityButtonText')}
              <DefaultDeleteIcon width="20px" height="20px" color="#fff" />
            </button>

            <button
              className={styles.exportEntityButton}
              onClick={() => {
                handleExportEntity(fileData)
              }}
            >
              {t('entityPage.content.main.interaction.exportEntityButtonText')}
              <DefaultFileExportIcon width="20px" height="20px" color="#fff" />
            </button>
          </div>

        </div>

        <div className={styles.branchesContent}>
          {fileData.branches.length === 0 ? (
            <div className={styles.noBranches}>{t('entityPage.content.main.branchContent.noBranches')}</div>
          ) : (
            <div className={styles.branchesView}>
              {fileData.branches.map((branch, index) => (
                <div key={branch.id} className={styles.branch}>

                  {/*Branch header*/}
                  <div className={styles.branchHeader}>
                    {activeBranchId === branch.id ? (
                      <div className={styles.branchHeaderEditBox}>
                        <textarea
                          className={styles.branchNameInput}
                          value={branchName}
                          maxLength={100}
                          onChange={(e) => setBranchName(e.target.value)}
                          placeholder={t('entityPage.content.main.branchContent.editBranch.inputNamePlaceholder')}
                        />
                        <div className={styles.branchHeaderEditBoxInteraction}>
                          <button
                            className={styles.cancelBranchEditButton}
                            onClick={() => {
                              setActiveBranchId(null);
                              setBranchName('');

                            }}
                          >
                            <DefaultCloseIcon width="24px" height="24px" color="#fff" />
                          </button>
                          <button
                            className={styles.confirmBranchEditButton}
                            onClick={async () => {
                              if (fileData) {
                                const updatedEntity = await updateBranch(fileData, branch.id, { name: branchName });
                                setFileData(updatedEntity);
                                setActiveBranchId(null);
                                setBranchName('');
                              }
                            }}
                          >
                            <DefaultSuccessIcon width="24px" height="24px" color="#fff" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className={styles.branchHeaderInfo}>
                          <h3 className={styles.branchTitle}>{branch.name || `${t('entityPage.content.main.branchContent.branchHeader.branchName')}`}</h3>
                          <p className={styles.branchHeaderInfoText}>{t('entityPage.content.main.branchContent.branchHeader.branchPointsLabel')}: {branch.points.length}</p>
                        </div>
                        <div className={styles.branchHeaderInteraction}>
                          <div className={styles.moveBranchButtons}>
                            <button
                              className={styles.moveBranchButton}
                              onClick={() => moveBranchUp(index)}
                              disabled={index === 0}
                              title="Move branch left"
                            >
                              <DefaultLeftArrowIcon width="24px" height="24px" />
                            </button>
                            <button
                              className={styles.moveBranchButton}
                              onClick={() => moveBranchDown(index)}
                              disabled={index === fileData.branches.length - 1}
                              title="Move branch right"
                            >
                              <DefaultRightArrowIcon width="24px" height="24px" />
                            </button>
                          </div>

                          <div className={styles.branchHeaderInteractionEdit}>
                            <button
                              className={styles.editBranchButton}
                              onClick={() => {
                                setBranchName(branch.name);
                                setActiveBranchId(branch.id)
                              }}
                              title={t('entityPage.content.main.branchContent.branchHeader.editBranchButtonTitle')}
                            >
                              <DefaultEditPencilIcon width="24px" height="24px" color="#fff" />
                            </button>
                            <button
                              onClick={() => openDeleteConfirmation(branch.id, branch.name)}
                              className={styles.deleteBranchButton}
                              title={t('entityPage.content.main.branchContent.branchHeader.deleteBranchButtonTitle')}
                            >
                              <DefaultDeleteIcon width="24px" height="24px" color="#fff" />
                            </button>
                          </div>


                        </div>
                      </>
                    )}
                  </div>

                  {/*Branch content*/}
                  <div className={styles.branchContent}>

                    <div className={styles.branchMain}>
                      {branch.points.length === 0 ? (
                        <div className={styles.noPointList}>
                          <p className={styles.noPointListText}>{t('entityPage.content.main.pointContent.noPoints.noPointsMessage')}</p>

                          <button
                            className={styles.newPointButton}
                            onClick={() => handleCreatePoint(branch.id)}
                          >
                            {t('entityPage.content.main.pointContent.noPoints.addPointButtonText')}
                          </button>
                        </div>

                      ) : (
                        <div className={styles.pointsList}>
                          {branch.points.map((point, index) => (

                            <div key={point.id} className={styles.point}>

                              {activePointId === point.id ? (
                                <div className={styles.pointEditBox}>

                                  <div className={styles.pointEditBoxInteraction}>
                                    <button
                                      onClick={() => {
                                        setPointToDelete({ branchId: branch.id, pointId: point.id, name: pointName });
                                        setIsDeletePointPopupOpen(true);
                                      }}
                                      className={styles.deleteBranchButton}
                                      title={t('entityPage.content.main.pointContent.editPoint.deletePointButtonTitle')}
                                    >
                                      <DefaultDeleteIcon width="24px" height="24px" color="#fff" />
                                    </button>
                                    <div className={styles.pointEditBoxConfirmation}>
                                      <button
                                        className={styles.cancelPointEditButton}
                                        title={t('entityPage.content.main.pointContent.editPoint.cancelButtonTitle')}
                                        onClick={() => {
                                          setActivePointId(null);
                                          setPointName('');
                                          setPointDescription('');
                                          setPointToUntilDate('');
                                        }}
                                      >
                                        <DefaultCloseIcon width="24px" height="24px" color="#fff" />
                                      </button>
                                      <button
                                        className={styles.confirmPointEditButton}
                                        title={t('entityPage.content.main.pointContent.editPoint.submitButtonTitle')}
                                        onClick={async () => {
                                          if (fileData) {
                                            const updatedEntity = await updatePoint(fileData, branch.id, point.id, { name: pointName, description: pointDescription, toDoUntil: pointToUntilDate });
                                            setFileData(updatedEntity);
                                            setActivePointId(null);
                                            setPointName('');
                                            setPointDescription('');
                                            setPointToUntilDate('');
                                          }
                                        }}
                                      >
                                        <DefaultSuccessIcon width="24px" height="24px" color="#fff" />
                                      </button>
                                    </div>
                                  </div>

                                  <div className={styles.pointInputBox}>
                                    <label className={styles.pointInputBoxLabel}>{t('entityPage.content.main.pointContent.editPoint.inputNameLabel')}</label>
                                    <input
                                      className={styles.pointInput}
                                      placeholder={t('entityPage.content.main.pointContent.editPoint.inputNamePlaceholder')}
                                      value={pointName}
                                      onChange={(e) => setPointName(e.target.value)}
                                    />
                                  </div>

                                  <div className={styles.pointInputBox}>
                                    <MarkdownEditor
                                      label={t('entityPage.content.main.pointContent.editPoint.inputDescriptionLabel')}
                                      value={pointDescription}
                                      onChange={(e) => setPointDescription(e.target.value)}
                                      placeholder={t('entityPage.content.main.pointContent.editPoint.inputDescriptionPlaceholder')}
                                    />

                                  </div>

                                  <div className={styles.pointInputBox}>
                                    <label className={styles.pointInputBoxLabel}>{t('entityPage.content.main.pointContent.editPoint.inputDoUntilLabel')}</label>
                                    <input
                                      className={styles.pointInput}
                                      type="datetime-local"
                                      value={pointToUntilDate}
                                      onChange={(e) => setPointToUntilDate(e.target.value)}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div className={`${styles.pointBox} ${branch.points.length === 1 ? styles.singlePoint : ''}`}>

                                  {branch.points.length > 1 && (
                                  <div className={styles.movePointButtons}>
                                    <button
                                      className={styles.movePointButton}
                                      onClick={() => movePointUp(branch.id, index)}
                                      disabled={index === 0}
                                      title="Move point up"
                                    >
                                      <DefaultArrowUpwardIcon width="20px" height="20px" />
                                    </button>
                                    <button
                                      className={styles.movePointButton}
                                      onClick={() => movePointDown(branch.id, index, branch.points.length)}
                                      disabled={index === branch.points.length - 1}
                                      title="Move point down"
                                    >
                                      <DefaultArrowDownwardIcon width="20px" height="20px" />
                                    </button>
                                  </div>
                                    )}

                                  <div className={styles.pointContent}>
                                  <div className={styles.pointHeader}>


                                    <h4 className={styles.pointName}>
                                      {point.name}
                                    </h4>

                                    <button
                                      className={styles.editPointButton}
                                      onClick={() => {
                                        setPointName(point.name);
                                        setPointDescription(point.description);
                                        setPointToUntilDate(point.toDoUntil);
                                        setActivePointId(point.id)
                                      }}
                                    >
                                      <DefaultEditPencilIcon width="20px" height="20px" color="#fff" />
                                    </button>
                                  </div>



                                  {point.description.length > 0 && (
                                    <div className={styles.pointDescription}>
                                      <MarkdownRenderer
                                        content={point.description}
                                      />

                                    </div>
                                  )}

                                  <p className={styles.pointDate}>{t('entityPage.content.main.pointContent.info.createdLabel')}: {new Date(point.createdAt).toLocaleString()}</p>

                                  {point.toDoUntil.length > 0 ? (
                                    <p className={styles.pointDate}>{t('entityPage.content.main.pointContent.info.doUntilLabel')}: {new Date(point.toDoUntil).toLocaleString()}</p>
                                  ) : (
                                    <p className={styles.pointDate}>{t('entityPage.content.main.pointContent.info.noLimitLabel')}</p>
                                  )}

                                  {point.subBranches.length > 0 && (
                                    <p className={styles.pointSubBranchesInfo}>{t('entityPage.content.main.pointContent.info.subbranchesLabel')}: {point.subBranches.length}</p>
                                  )}

                                  {/*{point.doneAt ? (*/}
                                  {/*  <p className={styles.pointDate}>Done At: {new Date(point.doneAt).toLocaleString()}</p>*/}
                                  {/*) : (*/}
                                  {/*  <></>*/}
                                  {/*)}*/}

                                  <div className={styles.statusBox}>
                                    <button
                                      className={`${styles.pointStatus} ${styles[`${point.status}`]}`}
                                      onClick={() => {
                                        setActiveGraphPointId(point.id)
                                        setIsStatusPopupOpen(true)}}
                                    >
                                      {formatStatus(point.status)}
                                    </button>

                                    {activeGraphPointId === point.id && (
                                      <EntityChangePointStatusPopup
                                        active={isStatusPopupOpen}
                                        onClose={() => {
                                          setActiveGraphPointId(null)
                                          setIsStatusPopupOpen(false)
                                        }}
                                        onSelectStatus={(newStatus) =>
                                          handleUpdatePointStatus(branch.id, point.id, newStatus)
                                        }
                                        currentStatus={point.status}
                                      />
                                    )}
                                  </div>

                                  {/*Subbranch*/}
                                  {activePointSubbranchesId === point.id ? (
                                    <>
                                      <button
                                        className={styles.pointViewMoreButton}
                                        onClick={() => {
                                          setActivePointSubbranchesId(null)
                                          setIsSubbranchActive(false)
                                        }}
                                      >
                                        {t('entityPage.content.main.subbranchContent.viewLessButtonText')} ↑
                                      </button>
                                      <div className={styles.subBranchContent}>
                                        {point.subBranches.length === 0 ? (
                                          <div className={styles.noSubBranchList}>
                                            <p className={styles.noSubBranchListText}>{t('entityPage.content.main.subbranchContent.noSubbranches.noSubbranchesMessage')}</p>

                                            <button
                                              className={styles.newSubBranchButton}
                                              onClick={() => handleCreateSubBranch(branch.id, point.id)}
                                            >
                                              {t('entityPage.content.main.subbranchContent.noSubbranches.createSubbranchButtonText')}
                                            </button>
                                          </div>

                                        ) : (
                                          <div className={styles.subBranchList}>
                                            {point.subBranches.map((subBranch, index) => (
                                              <div className={styles.subBranch} key={subBranch.id}>
                                                {activeSubbranchId === subBranch.id ? (
                                                  <div className={styles.subBranchEditBox}>
                                                    <div className={styles.subBranchEditBoxInteraction}>
                                                      <button
                                                        onClick={() => {
                                                          setSubBranchToDelete({ branchId: branch.id, pointId: point.id, subBranchId: subBranch.id, name: subBranch.name });
                                                          setIsDeleteSubbranchPopupOpen(true);
                                                        }}
                                                        className={styles.deleteSubBranchButton}
                                                        title={t('entityPage.content.main.subbranchContent.editSubbranch.deleteSubbranchButtonTitle')}
                                                      >
                                                        <DefaultDeleteIcon width="24px" height="24px" color="#fff" />
                                                      </button>
                                                      <div className={styles.subBranchEditBoxConfirmation}>
                                                        <button
                                                          className={styles.cancelSubBranchEditButton}
                                                          title={t('entityPage.content.main.subbranchContent.editSubbranch.cancelButtonTitle')}
                                                          onClick={() => {
                                                            setActiveSubbranchId(null);
                                                            setSubBranchName('');
                                                            setSubBranchDescription('');
                                                            setSubBranchToUntilDate('');
                                                          }}
                                                        >
                                                          <DefaultCloseIcon width="24px" height="24px" color="#fff" />
                                                        </button>
                                                        <button
                                                          className={styles.confirmSubBranchEditButton}
                                                          title={t('entityPage.content.main.subbranchContent.editSubbranch.submitButtonTitle')}
                                                          onClick={async () => {
                                                            if (fileData) {
                                                              const updatedEntity = await updateSubBranchInPoint(fileData, branch.id, point.id, subBranch.id, { name: subBranchName, description: subBranchDescription, toDoUntil: subBranchToUntilDate });
                                                              setFileData(updatedEntity);
                                                              setActiveSubbranchId(null);
                                                              setSubBranchName('');
                                                              setSubBranchDescription('');
                                                              setSubBranchToUntilDate('');
                                                            }
                                                          }}
                                                        >
                                                          <DefaultSuccessIcon width="24px" height="24px" color="#fff" />
                                                        </button>
                                                      </div>
                                                    </div>

                                                    <div className={styles.subBranchInputBox}>
                                                      <label className={styles.subBranchInputBoxLabel}>{t('entityPage.content.main.subbranchContent.editSubbranch.inputNameLabel')}</label>
                                                      <input
                                                        className={styles.subBranchInput}
                                                        placeholder={t('entityPage.content.main.subbranchContent.editSubbranch.inputNamePlaceholder')}
                                                        value={subBranchName}
                                                        onChange={(e) => setSubBranchName(e.target.value)}
                                                      />
                                                    </div>

                                                    <div className={styles.subBranchInputBox}>
                                                      <MarkdownEditor
                                                        label={t('entityPage.content.main.subbranchContent.editSubbranch.inputDescriptionLabel')}
                                                        placeholder={t('entityPage.content.main.subbranchContent.editSubbranch.inputDescriptionPlaceholder')}
                                                        value={subBranchDescription}
                                                        onChange={(e) => setSubBranchDescription(e.target.value)}
                                                      />
                                                    </div>

                                                    <div className={styles.subBranchInputBox}>
                                                      <label className={styles.subBranchInputBoxLabel}>{t('entityPage.content.main.subbranchContent.editSubbranch.inputDoUntilLabel')}</label>
                                                      <input
                                                        className={styles.subBranchInput}
                                                        type="datetime-local"
                                                        value={subBranchToUntilDate}
                                                        onChange={(e) => setSubBranchToUntilDate(e.target.value)}
                                                      />
                                                    </div>
                                                  </div>
                                                ) : (
                                                  <div className={styles.subBranchBox}>

                                                    <div className={styles.moveSubbranchButtons}>
                                                      <button
                                                        className={styles.moveSubbranchButton}
                                                        onClick={() => moveSubBranchUp(branch.id, point.id, index)}
                                                        disabled={index === 0}
                                                        title="Move subbranch up"
                                                      >
                                                        <DefaultArrowUpwardIcon width="20px" height="20px" />
                                                      </button>
                                                      <button
                                                        className={styles.moveSubbranchButton}
                                                        onClick={() => moveSubBranchDown(branch.id, point.id, index, point.subBranches.length)}
                                                        disabled={index === point.subBranches.length - 1}
                                                        title="Move subbranch down"
                                                      >
                                                        <DefaultArrowDownwardIcon width="20px" height="20px" />
                                                      </button>
                                                    </div>

                                                    <div className={styles.subBranchMainContent}>

                                                      <div className={styles.subBranchHeader}>
                                                        <h4 className={styles.subBranchName}>
                                                          {subBranch.name}
                                                        </h4>

                                                        <button
                                                          className={styles.editSubBranchButton}
                                                          onClick={() => {
                                                            setSubBranchName(subBranch.name);
                                                            setSubBranchDescription(subBranch.description);
                                                            setSubBranchToUntilDate(subBranch.toDoUntil);
                                                            setActiveSubbranchId(subBranch.id);
                                                          }}
                                                        >
                                                          <DefaultEditPencilIcon width="20px" height="20px" color="#fff" />
                                                        </button>
                                                      </div>


                                                      {subBranch.description.length > 0 && (
                                                        <div className={styles.subBranchDescription}>

                                                          <MarkdownRenderer
                                                            content={subBranch.description}
                                                          />
                                                        </div>
                                                      )}

                                                      <p className={styles.subBranchDate}>{t('entityPage.content.main.subbranchContent.info.createdLabel')}: {new Date(subBranch.createdAt).toLocaleString()}</p>

                                                      {subBranch.toDoUntil.length > 0 ? (
                                                        <p className={styles.subBranchDate}>{t('entityPage.content.main.subbranchContent.info.doUntilLabel')}: {new Date(subBranch.toDoUntil).toLocaleString()}</p>
                                                      ) : (
                                                        <p className={styles.subBranchDate}>{t('entityPage.content.main.subbranchContent.info.noLimitLabel')}</p>
                                                      )}

                                                      <div className={styles.statusBox}>
                                                        <button
                                                          className={`${styles.subBranchStatus} ${styles[`${subBranch.status}`]}`}
                                                          onClick={() => {
                                                            setActiveSubbranchStatusId(subBranch.id);
                                                            setIsSubbranchStatusPopupOpen(true);
                                                          }}
                                                        >
                                                          {formatStatus(subBranch.status)}
                                                        </button>

                                                        {activeSubbranchStatusId === subBranch.id && (
                                                          <EntityChangePointStatusPopup
                                                            active={isSubbranchStatusPopupOpen}
                                                            onClose={() => {
                                                              setActiveSubbranchStatusId(null);
                                                              setIsSubbranchStatusPopupOpen(false);
                                                            }}
                                                            onSelectStatus={(newStatus) =>
                                                              handleUpdateSubBranchStatus(branch.id, point.id, subBranch.id, newStatus)
                                                            }
                                                            currentStatus={subBranch.status}
                                                          />
                                                        )}
                                                      </div>
                                                    </div>

                                                  </div>
                                                )}

                                              </div>
                                            ))}

                                            <button
                                              className={styles.newSubBranchButton}
                                              onClick={() => handleCreateSubBranch(branch.id, point.id)}
                                            >
                                              {t('entityPage.content.main.subbranchContent.createSubbranchButtonText')}
                                            </button>
                                          </div>
                                        )}

                                      </div>
                                    </>
                                    ) : (
                                    <>
                                      <button
                                        className={styles.pointViewMoreButton}
                                        onClick={() => {
                                          setActivePointSubbranchesId(point.id)
                                          setIsSubbranchActive(true)
                                        }}
                                      >
                                        {t('entityPage.content.main.subbranchContent.viewMoreButtonText')} ↓
                                      </button>
                                    </>
                                  )}
                                </div>
                                </div>
                              )}
                            </div>

                          ))}
                          <div className={styles.pointListInteraction}>
                            <button
                              className={styles.newPointButton}
                              onClick={() => handleCreatePoint(branch.id)}
                            >
                              {t('entityPage.content.main.pointContent.createPointButtonText')}
                            </button>
                          </div>
                        </div>
                      )}


                    </div>

                    <div className={styles.branchGraph}>
                      {branch.points.map((point, index) => (
                        <div className={styles.branchGraphColumn} key={point.id}>
                          <span
                            className={`${styles.graphPoint} ${styles[`${point.status}`]}`}
                            key={point.id}
                          >
                            <Tooltip
                              text={point.name}
                              position="right"
                              offset={8}
                              header={
                                <div className={styles.graphPointTooltipHeader}>
                                  <h4>{point.name}</h4>
                                  <CircularProgress
                                    percent={
                                      point.subBranches.length > 0
                                        ? calculateSubBranchPercent(point.subBranches)
                                        : point.status !== 'done' ? 0 : 100
                                    }
                                    size={44}
                                    strokeWidth={4}
                                  />
                                </div>
                              }
                              content={
                                <>
                                  {point.subBranches.length > 0 ? (
                                    <div className={styles.graphSubBranchList}>
                                      {point.subBranches.map((subBranch) => (
                                        <div className={styles.graphSubBranch} key={subBranch.id}>
                                          <div>{subBranch.name}</div>
                                          <div className={`${styles.subBranchStatus} ${styles[`${subBranch.status}`]}`}>
                                            {formatStatus(subBranch.status)}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <></>
                                  )}
                                </>
                              }
                            />
                          </span>
                          {index !== branch.points.length - 1 && (
                            <span className={`${styles.pointsLine} ${styles[`${point.status}`]}`}></span>
                          )}

                        </div>
                      ))}
                    </div>

                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <EntityCreateBranchPopup
        active={isCreateBranchPopupOpen}
        onClose={() => setIsCreateBranchPopupOpen(false)}
        onCreateBranch={handleCreateBranch}
      />

      {isDeleteEntityPopupOpen && fileData && (
        <EntityDeleteEntityPopup
          active={isDeleteEntityPopupOpen}
          onClose={() => setIsDeleteEntityPopupOpen(false)}
          onConfirm={() => handleDeleteEntity(fileData.id)}
          itemName={fileData?.name || ''}
          itemType={t('entityPage.popup.deleteEntity.itemType')}
        />
      )}

      {isDeleteBranchPopupOpen && branchToDelete &&
          <EntityDeleteBranchPopup
              active={isDeleteBranchPopupOpen}
              onClose={() => {
                setIsDeleteBranchPopupOpen(false);
                setBranchToDelete(null);
              }}
              onConfirm={() => {
                if (branchToDelete) {
                  handleDeleteBranch(branchToDelete.id);
                }
              }}
              itemName={branchToDelete?.name || ''}
              itemType={t('entityPage.popup.deleteBranch.itemType')}
          />
      }

      {isDeletePointPopupOpen && pointToDelete && (
        <EntityDeletePointPopup
          active={isDeletePointPopupOpen}
          onClose={() => {
            setIsDeletePointPopupOpen(false)
            setPointToDelete(null);
          }}
          onConfirm={() => {
            if (pointToDelete) {
              handleDeletePoint(pointToDelete.branchId, pointToDelete.pointId)
            }
          }}
          itemName={pointToDelete?.name || ''}
          itemType={t('entityPage.popup.deletePoint.itemType')}
        />
      )}

      {isDeleteSubbranchPopupOpen && subBranchToDelete && (
        <EntityDeleteSubBranchPopup
          active={isDeleteSubbranchPopupOpen}
          onClose={() => {
            setIsDeleteSubbranchPopupOpen(false)
            setSubBranchToDelete(null);
          }}
          onConfirm={() => {
            if (subBranchToDelete) {
              handleDeleteSubBranch(subBranchToDelete.branchId, subBranchToDelete.pointId, subBranchToDelete.subBranchId)
            }
          }}
          itemName={subBranchToDelete?.name || ''}
          itemType={t('entityPage.popup.deleteSubbranch.itemType')}
        />
      )}

      {isGraphModalOpen && fileData && (
        <EntityGraphModal
          active={isGraphModalOpen}
          onClose={() => setIsGraphModalOpen(false)}
          fileData={fileData}
        />
      )}

    </div>
  );
}

export default EntityContent;