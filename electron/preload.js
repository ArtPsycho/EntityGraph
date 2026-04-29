const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    isElectron: true,
    writeEntityFile: (fileName, data) => ipcRenderer.invoke('electron:write-entity', fileName, data),
    readEntityFile: (fileName) => ipcRenderer.invoke('electron:read-entity', fileName),
    deleteEntityFile: (fileName) => ipcRenderer.invoke('electron:delete-entity', fileName),
    listEntityFiles: () => ipcRenderer.invoke('electron:list-entities'),
    exportFile: (data, defaultName) => ipcRenderer.invoke('electron:export-file', data, defaultName),
    importFile: () => ipcRenderer.invoke('electron:import-file'),
});