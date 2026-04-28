import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import type { Entity, EntityListItem } from '../types/entity';

const isElectron = (): boolean => (window as any).electronAPI?.isElectron === true;
const isCapacitor = (): boolean => !!(window as any).Capacitor?.isNativePlatform();

let db: IDBDatabase | null = null;

const initIndexedDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open('EntityManagerDB', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      if (!database.objectStoreNames.contains('entities')) {
        database.createObjectStore('entities', { keyPath: 'fileName' });
      }
    };
  });
};

function ensureNotesField(entity: any): Entity {
  if (!entity) return entity;

  if (entity.notes === undefined) {
    console.log(`Adding notes array to entity: ${entity.id}`);
    entity.notes = [];
  }

  if (!Array.isArray(entity.notes)) {
    console.warn(`Entity ${entity.id}: notes field is not an array, resetting to empty array`);
    entity.notes = [];
  }

  return entity as Entity;
}

export async function saveEntity(fileName: string, data: Entity): Promise<{ success: boolean }> {
  const saveData = { ...data };
  if (saveData.notes === undefined) {
    saveData.notes = [];
  }

  if (isElectron()) {
    return await (window as any).electronAPI.writeEntityFile(fileName, saveData);
  } else if (isCapacitor()) {
    const path = `entities/${fileName}`;
    await Filesystem.mkdir({
      path: 'entities',
      directory: Directory.Data,
      recursive: true,
    });
    await Filesystem.writeFile({
      path: path,
      data: JSON.stringify(saveData, null, 2),
      directory: Directory.Data,
    });
    return { success: true };
  } else {
    const database = await initIndexedDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(['entities'], 'readwrite');
      const store = transaction.objectStore('entities');
      const request = store.put({ fileName, data: saveData });

      request.onsuccess = () => resolve({ success: true });
      request.onerror = () => reject(request.error);
    });
  }
}

export async function loadEntity(fileName: string): Promise<Entity | null> {
  if (isElectron()) {
    const entity = await (window as any).electronAPI.readEntityFile(fileName);
    return ensureNotesField(entity);
  } else if (isCapacitor()) {
    try {
      const path = `entities/${fileName}`;
      const result = await Filesystem.readFile({
        path: path,
        directory: Directory.Data,
      });
      let jsonString: string;
      if (typeof result.data === 'string') {
        jsonString = result.data;
      } else {
        jsonString = await result.data.text();
      }
      const entity = JSON.parse(jsonString) as Entity;
      return ensureNotesField(entity);
    } catch {
      return null;
    }
  } else {
    const database = await initIndexedDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(['entities'], 'readonly');
      const store = transaction.objectStore('entities');
      const request = store.get(fileName);

      request.onsuccess = () => {
        const result = request.result;
        const entity = result?.data || null;
        resolve(ensureNotesField(entity));
      };
      request.onerror = () => reject(request.error);
    });
  }
}

export async function deleteEntity(fileName: string): Promise<{ success: boolean }> {
  if (isElectron()) {
    return await (window as any).electronAPI.deleteEntityFile(fileName);
  } else if (isCapacitor()) {
    const path = `entities/${fileName}`;
    await Filesystem.deleteFile({
      path: path,
      directory: Directory.Data,
    });
    return { success: true };
  } else {
    const database = await initIndexedDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(['entities'], 'readwrite');
      const store = transaction.objectStore('entities');
      const request = store.delete(fileName);

      request.onsuccess = () => resolve({ success: true });
      request.onerror = () => reject(request.error);
    });
  }
}

export async function listEntities(): Promise<EntityListItem[]> {
  if (isElectron()) {
    return await (window as any).electronAPI.listEntityFiles();
  } else if (isCapacitor()) {
    try {
      const result = await Filesystem.readdir({
        path: 'entities',
        directory: Directory.Data,
      });

      const entities: EntityListItem[] = [];
      for (const file of result.files) {
        if (file.name.endsWith('.json')) {
          const fileData = await Filesystem.readFile({
            path: `entities/${file.name}`,
            directory: Directory.Data,
          });
          let jsonString: string;
          if (typeof fileData.data === 'string') {
            jsonString = fileData.data;
          } else {
            jsonString = await fileData.data.text();
          }
          const entity = JSON.parse(jsonString) as Entity;
          entities.push({
            id: entity.id,
            fileName: file.name,
            name: entity.name,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
          });
        }
      }
      return entities;
    } catch {
      return [];
    }
  } else {
    const database = await initIndexedDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(['entities'], 'readonly');
      const store = transaction.objectStore('entities');
      const request = store.getAll();

      request.onsuccess = () => {
        const entities: EntityListItem[] = request.result.map((item: any) => ({
          id: item.data.id,
          fileName: item.fileName,
          name: item.data.name,
          createdAt: item.data.createdAt,
          updatedAt: item.data.updatedAt,
        }));
        resolve(entities);
      };
      request.onerror = () => reject(request.error);
    });
  }
}

export async function exportData(data: any, defaultName: string): Promise<{ success: boolean }> {
  if (isElectron()) {
    return await (window as any).electronAPI.exportFile(data, defaultName);
  } else if (isCapacitor()) {
    const jsonString = JSON.stringify(data, null, 2);
    const fileName = defaultName || `export_${Date.now()}.json`;

    await Filesystem.writeFile({
      path: fileName,
      data: jsonString,
      directory: Directory.Cache,
    });

    await Share.share({
      title: 'Export Entity',
      text: 'Exporting entity data',
      url: fileName,
    });

    return { success: true };
  } else {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = defaultName || `export_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return { success: true };
  }
}

export async function importData(): Promise<any> {
  if (isElectron()) {
    return await (window as any).electronAPI.importFile();
  } else if (isCapacitor()) {
    try {
      const result = await FilePicker.pickFiles({
        types: ['application/json'],
        readData: true,
      });

      if (result.files && result.files[0]) {
        const file = result.files[0];
        let jsonString = '';

        if (file.data) {
          try {
            jsonString = decodeURIComponent(escape(atob(file.data)));
          } catch {
            jsonString = file.data;
          }
        } else if (file.path) {
          const content = await Filesystem.readFile({
            path: file.path,
            directory: Directory.Data,
          });
          jsonString = typeof content.data === 'string' ? content.data : await content.data.text();
        }

        if (jsonString) {
          const data = JSON.parse(jsonString);

          if (data && data.notes === undefined) {
            data.notes = [];
          }

          if (Array.isArray(data)) {
            return data;
          }
          if (data.entities && Array.isArray(data.entities)) {
            return data.entities;
          }
          return data;
        }
      }
      return null;
    } catch (error) {
      console.error('Error picking file:', error);
      return null;
    }
  } else {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/json';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const data = JSON.parse(e.target?.result as string);

              if (data && data.notes === undefined) {
                data.notes = [];
              }

              if (Array.isArray(data)) {
                resolve(data);
              } else if (data.entities && Array.isArray(data.entities)) {
                resolve(data.entities);
              } else {
                resolve(data);
              }
            } catch {
              resolve(null);
            }
          };
          reader.readAsText(file);
        } else {
          resolve(null);
        }
      };
      input.click();
    });
  }
}