import React from 'react';
import type { Entity } from '../../types/entity';

interface ExportImportProps {
  onExportAll: () => void;
  onImport: () => void;
  onExportEntity?: (entity: Entity) => void;
  currentEntity?: Entity | null;
}

export const ExportImport: React.FC<ExportImportProps> = ({
  onExportAll,
  onImport,
  onExportEntity,
  currentEntity
}) => {
  return (
    <div className="export-import-bar">
      <div className="button-group">
        <button onClick={onExportAll} className="export-all-btn">
          Export All Entities
        </button>
        <button onClick={onImport} className="import-btn">
          Import Entity
        </button>
        {currentEntity && onExportEntity && (
          <button onClick={() => onExportEntity(currentEntity)} className="export-btn">
            Export Current Entity
          </button>
        )}
      </div>
    </div>
  );
};