const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const fs = require('fs').promises;

// Более надежная проверка dev режима
const isDev = !app.isPackaged;

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        icon: path.resolve(__dirname, '../build/icon.ico'),
    });

    if (isDev) {
        // В режиме разработки загружаем с dev сервера
        console.log('Running in development mode');
        mainWindow.loadURL('http://localhost:3002');
        mainWindow.webContents.openDevTools();
    } else {
        // В продакшене загружаем из dist
        const indexPath = path.join(__dirname, '../dist/index.html');
        console.log('Running in production mode, loading:', indexPath);
        mainWindow.loadFile(indexPath);
    }

    // Отладка: показать ошибки загрузки
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
        console.error('Failed to load:', errorCode, errorDescription, validatedURL);
    });
}

app.whenReady().then(() => {
    const menu = Menu.buildFromTemplate([]);
    Menu.setApplicationMenu(menu);

    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// Остальные IPC handlers остаются без изменений...
ipcMain.handle('electron:write-entity', async (event, fileName, data) => {
    const userDataPath = app.getPath('userData');
    const entitiesPath = path.join(userDataPath, 'entities');
    await fs.mkdir(entitiesPath, { recursive: true });
    await fs.writeFile(path.join(entitiesPath, fileName), JSON.stringify(data, null, 2));
    return { success: true };
});

ipcMain.handle('electron:read-entity', async (event, fileName) => {
    const userDataPath = app.getPath('userData');
    const filePath = path.join(userDataPath, 'entities', fileName);
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch {
        return null;
    }
});

ipcMain.handle('electron:delete-entity', async (event, fileName) => {
    const userDataPath = app.getPath('userData');
    const filePath = path.join(userDataPath, 'entities', fileName);
    await fs.unlink(filePath);
    return { success: true };
});

ipcMain.handle('electron:list-entities', async () => {
    const userDataPath = app.getPath('userData');
    const entitiesPath = path.join(userDataPath, 'entities');
    try {
        const files = await fs.readdir(entitiesPath);
        const entities = [];
        for (const file of files) {
            if (file.endsWith('.json')) {
                const data = await fs.readFile(path.join(entitiesPath, file), 'utf8');
                const entity = JSON.parse(data);
                entities.push({
                    id: entity.id,
                    fileName: file,
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
});

ipcMain.handle('electron:export-file', async (event, data, defaultName) => {
    const { filePath } = await dialog.showSaveDialog(mainWindow, {
        defaultPath: defaultName || `export_${Date.now()}.json`,
        filters: [{ name: 'JSON', extensions: ['json'] }]
    });
    if (filePath) {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    }
    return { success: !!filePath };
});

ipcMain.handle('electron:import-file', async () => {
    const { filePaths } = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [{ name: 'JSON', extensions: ['json'] }]
    });
    if (filePaths[0]) {
        const data = await fs.readFile(filePaths[0], 'utf8');
        return JSON.parse(data);
    }
    return null;
});