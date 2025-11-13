const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectFile: () => ipcRenderer.invoke('select-file'),
  saveProject: (data) => ipcRenderer.invoke('save-project', data),
  loadProject: (filePath) => ipcRenderer.invoke('load-project', filePath),
  
  browseAvcFile: () => ipcRenderer.invoke('browse-avc-file'),
  listAvcFiles: () => ipcRenderer.invoke('list-avc-files'),
  createAvcFile: (name) => ipcRenderer.invoke('create-avc-file', name),
  launchArenaComposition: (avcPath) => ipcRenderer.invoke('launch-arena-composition', avcPath),
  
  getProjectsPath: () => ipcRenderer.invoke('get-projects-path'),
  saveCompanionProject: (project) => ipcRenderer.invoke('save-companion-project', project),
  loadCompanionProject: (projectId) => ipcRenderer.invoke('load-companion-project', projectId),
  listCompanionProjects: () => ipcRenderer.invoke('list-companion-projects'),
  deleteCompanionProject: (projectId) => ipcRenderer.invoke('delete-companion-project', projectId),
});
