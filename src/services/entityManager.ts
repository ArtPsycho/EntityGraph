import { nanoid } from 'nanoid';
import { saveEntity, loadEntity, deleteEntity, listEntities } from './storage';
import type { Entity, Branch, Point, SubBranch, EntityListItem } from '../types/entity';

export async function createEntity(name: string): Promise<Entity> {
  const id = nanoid();
  const fileName = `${id}.json`;
  const entity: Entity = {
    id,
    name,
    fileName,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    branches: [],
  };

  await saveEntity(fileName, entity);
  return entity;
}

export async function updateEntity(entity: Entity): Promise<Entity> {
  entity.updatedAt = new Date().toISOString();
  await saveEntity(entity.fileName, entity);
  return entity;
}

export async function updateEntityName(entity: Entity, newName: string): Promise<Entity> {
  const updatedEntity = {
    ...entity,
    name: newName
  };

  return await updateEntity(updatedEntity);
}

export async function getEntity(fileName: string): Promise<Entity | null> {
  return await loadEntity(fileName);
}

export async function removeEntity(fileName: string): Promise<void> {
  await deleteEntity(fileName);
}

export async function getAllEntities(): Promise<EntityListItem[]> {
  return await listEntities();
}

// Branch operations
export async function addBranch(entity: Entity, branchName: string): Promise<Entity> {
  const newBranch: Branch = {
    id: nanoid(),
    name: branchName,
    createdAt: new Date().toISOString(),
    points: [],
  };

  const updatedEntity = {
    ...entity,
    branches: [...entity.branches, newBranch]
  };

  return await updateEntity(updatedEntity);
}

export async function updateBranch(
  entity: Entity,
  branchId: string,
  updates: Partial<Omit<Branch, 'id' | 'createdAt' | 'points'>>
): Promise<Entity> {
  const updatedEntity = {
    ...entity,
    branches: entity.branches.map(branch => {
      if (branch.id === branchId) {
        return { ...branch, ...updates };
      }
      return branch;
    })
  };

  return await updateEntity(updatedEntity);
}

export async function deleteBranch(entity: Entity, branchId: string): Promise<Entity> {
  const updatedEntity = {
    ...entity,
    branches: entity.branches.filter(b => b.id !== branchId)
  };

  return await updateEntity(updatedEntity);
}

// Point operations for Branch
export async function addPointToBranch(
  entity: Entity,
  branchId: string,
  pointData: Omit<Point, 'id' | 'createdAt' | 'subBranches'>
): Promise<Entity> {
  const updatedEntity = {
    ...entity,
    branches: entity.branches.map(branch => {
      if (branch.id === branchId) {
        const newPoint: Point = {
          id: nanoid(),
          createdAt: new Date().toISOString(),
          subBranches: [],
          ...pointData,
        };
        return {
          ...branch,
          points: [...branch.points, newPoint]
        };
      }
      return branch;
    })
  };

  return await updateEntity(updatedEntity);
}

export async function updatePoint(
  entity: Entity,
  branchId: string,
  pointId: string,
  updates: Partial<Omit<Point, 'id' | 'createdAt' | 'subBranches'>>
): Promise<Entity> {
  const updatedEntity = {
    ...entity,
    branches: entity.branches.map(branch => {
      if (branch.id === branchId) {
        return {
          ...branch,
          points: branch.points.map(point => {
            if (point.id === pointId) {
              const updatedPoint = { ...point, ...updates };
              if (updates.status === 'done' && !updatedPoint.doneAt) {
                updatedPoint.doneAt = new Date().toISOString();
              }
              return updatedPoint;
            }
            return point;
          })
        };
      }
      return branch;
    })
  };

  return await updateEntity(updatedEntity);
}

export async function deletePoint(
  entity: Entity,
  branchId: string,
  pointId: string
): Promise<Entity> {
  const updatedEntity = {
    ...entity,
    branches: entity.branches.map(branch => {
      if (branch.id === branchId) {
        return {
          ...branch,
          points: branch.points.filter(point => point.id !== pointId)
        };
      }
      return branch;
    })
  };

  return await updateEntity(updatedEntity);
}

export async function addSubBranchToPoint(
  entity: Entity,
  branchId: string,
  pointId: string,
  subBranchData: Omit<SubBranch, 'id' | 'createdAt' | 'doneAt'>
): Promise<Entity> {
  const newSubBranch: SubBranch = {
    id: nanoid(),
    createdAt: new Date().toISOString(),
    ...subBranchData,
  };

  const updatedEntity = {
    ...entity,
    branches: entity.branches.map(branch => {
      if (branch.id === branchId) {
        return {
          ...branch,
          points: branch.points.map(point => {
            if (point.id === pointId) {
              return {
                ...point,
                subBranches: [...point.subBranches, newSubBranch]
              };
            }
            return point;
          })
        };
      }
      return branch;
    })
  };

  return await updateEntity(updatedEntity);
}

export async function updateSubBranchInPoint(
  entity: Entity,
  branchId: string,
  pointId: string,
  subBranchId: string,
  updates: Partial<Omit<SubBranch, 'id' | 'createdAt'>>
): Promise<Entity> {
  const updatedEntity = {
    ...entity,
    branches: entity.branches.map(branch => {
      if (branch.id === branchId) {
        return {
          ...branch,
          points: branch.points.map(point => {
            if (point.id === pointId) {
              return {
                ...point,
                subBranches: point.subBranches.map(subBranch => {
                  if (subBranch.id === subBranchId) {
                    const updatedSubBranch = { ...subBranch, ...updates };
                    if (updates.status === 'done' && !updatedSubBranch.doneAt) {
                      updatedSubBranch.doneAt = new Date().toISOString();
                    }
                    return updatedSubBranch;
                  }
                  return subBranch;
                })
              };
            }
            return point;
          })
        };
      }
      return branch;
    })
  };

  return await updateEntity(updatedEntity);
}

export async function deleteSubBranchFromPoint(
  entity: Entity,
  branchId: string,
  pointId: string,
  subBranchId: string
): Promise<Entity> {
  const updatedEntity = {
    ...entity,
    branches: entity.branches.map(branch => {
      if (branch.id === branchId) {
        return {
          ...branch,
          points: branch.points.map(point => {
            if (point.id === pointId) {
              return {
                ...point,
                subBranches: point.subBranches.filter(subBranch => subBranch.id !== subBranchId)
              };
            }
            return point;
          })
        };
      }
      return branch;
    })
  };

  return await updateEntity(updatedEntity);
}

export function validateEntity(entity: Partial<Entity>): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!entity.name || entity.name.trim() === '') {
    errors.name = 'Name is required';
  }
  return errors;
}

export async function importEntity(importedData: Entity): Promise<Entity> {
  const newId = nanoid();
  const newFileName = `${newId}.json`;

  const entityToImport: Entity = {
    ...importedData,
    id: newId,
    fileName: newFileName,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    branches: importedData.branches.map(branch => ({
      ...branch,
      id: nanoid(),
      points: branch.points.map(point => ({
        ...point,
        id: nanoid(),
        subBranches: point.subBranches.map(subBranch => ({
          ...subBranch,
          id: nanoid()
        }))
      }))
    }))
  };

  await saveEntity(newFileName, entityToImport);
  return entityToImport;
}