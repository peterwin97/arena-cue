const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectFile: () => ipcRenderer.invoke('select-file'),
  saveProject: (data) => ipcRenderer.invoke('save-project', data),
  loadProject: (filePath) => ipcRenderer.invoke('load-project', filePath),
});
