import {Entity} from "../types/entity";
import {loadEntity} from "./storage";

export function migrateEntity(data: any): Entity {
  const migratedEntity = { ...data };

  if (!migratedEntity.notes) {
    console.log(`Migrating entity ${migratedEntity.id}: adding notes array`);
    migratedEntity.notes = [];
  }

  if (!Array.isArray(migratedEntity.notes)) {
    console.warn(`Entity ${migratedEntity.id}: notes field is not an array, resetting to empty array`);
    migratedEntity.notes = [];
  }

  return migratedEntity as Entity;
}

export async function loadEntityWithMigration(fileName: string): Promise<Entity | null> {
  const entity = await loadEntity(fileName);

  if (entity) {
    return migrateEntity(entity);
  }

  return null;
}