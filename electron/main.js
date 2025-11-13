const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { v4: uuidv4 } = require('uuid');

const isDev = !app.isPackaged;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    backgroundColor: '#1a1a1a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:8080');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../client/dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Helper functions
function getResolumeCompositionsPath() {
  return path.join(os.homedir(), 'Documents', 'Resolume Arena', 'Compositions');
}

function getCompanionProjectsPath() {
  const projectsPath = path.join(os.homedir(), 'Documents', 'Resolume Companion', 'Projects');
  if (!fs.existsSync(projectsPath)) {
    fs.mkdirSync(projectsPath, { recursive: true });
  }
  return projectsPath;
}

// Existing IPC Handlers
ipcMain.handle('select-file', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Resolume Projects', extensions: ['json'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

ipcMain.handle('save-project', async (event, data) => {
  const result = await dialog.showSaveDialog({
    filters: [{ name: 'Resolume Projects', extensions: ['json'] }]
  });
  
  if (!result.canceled && result.filePath) {
    fs.writeFileSync(result.filePath, JSON.stringify(data, null, 2));
    return { success: true, path: result.filePath };
  }
  return { success: false };
});

ipcMain.handle('load-project', async (event, filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return { success: true, data: JSON.parse(data) };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// New IPC Handlers for Arena Integration

ipcMain.handle('browse-avc-file', async () => {
  const compositionsPath = getResolumeCompositionsPath();
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    defaultPath: compositionsPath,
    filters: [
      { name: 'Arena Compositions', extensions: ['avc'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

ipcMain.handle('list-avc-files', async () => {
  const compositionsPath = getResolumeCompositionsPath();
  
  try {
    if (!fs.existsSync(compositionsPath)) {
      return [];
    }
    
    const files = fs.readdirSync(compositionsPath);
    const avcFiles = files
      .filter(file => file.endsWith('.avc'))
      .map(file => ({
        name: file,
        path: path.join(compositionsPath, file)
      }));
    
    return avcFiles;
  } catch (error) {
    console.error('Error listing .avc files:', error);
    return [];
  }
});

ipcMain.handle('create-avc-file', async (event, name) => {
  try {
    const compositionsPath = getResolumeCompositionsPath();
    
    if (!fs.existsSync(compositionsPath)) {
      fs.mkdirSync(compositionsPath, { recursive: true });
    }
    
    const fileName = name.endsWith('.avc') ? name : `${name}.avc`;
    const filePath = path.join(compositionsPath, fileName);
    
    // Check if file already exists
    if (fs.existsSync(filePath)) {
      return { success: false, error: 'File already exists' };
    }
    
    // Create minimal Arena composition structure
    const minimalComposition = {
      version: "7.0.0",
      name: name.replace('.avc', ''),
      layers: [
        {
          id: 1,
          name: "Layer 1",
          clips: []
        },
        {
          id: 2,
          name: "Layer 2",
          clips: []
        },
        {
          id: 3,
          name: "Layer 3",
          clips: []
        }
      ],
      columns: [],
      settings: {
        width: 1920,
        height: 1080,
        fps: 60
      }
    };
    
    fs.writeFileSync(filePath, JSON.stringify(minimalComposition, null, 2));
    return { success: true, path: filePath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('launch-arena-composition', async (event, avcPath) => {
  try {
    if (!fs.existsSync(avcPath)) {
      return { success: false, error: 'Composition file not found' };
    }
    
    await shell.openPath(avcPath);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-projects-path', async () => {
  return getCompanionProjectsPath();
});

ipcMain.handle('save-companion-project', async (event, project) => {
  try {
    const projectsPath = getCompanionProjectsPath();
    const projectId = project.id || uuidv4();
    const fileName = `${projectId}.json`;
    const filePath = path.join(projectsPath, fileName);
    
    const projectData = {
      ...project,
      id: projectId,
      lastOpened: new Date().toISOString()
    };
    
    fs.writeFileSync(filePath, JSON.stringify(projectData, null, 2));
    return { success: true, path: filePath, id: projectId };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('load-companion-project', async (event, projectId) => {
  try {
    const projectsPath = getCompanionProjectsPath();
    const filePath = path.join(projectsPath, `${projectId}.json`);
    
    if (!fs.existsSync(filePath)) {
      return { success: false, error: 'Project not found' };
    }
    
    const data = fs.readFileSync(filePath, 'utf-8');
    return { success: true, data: JSON.parse(data) };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('list-companion-projects', async () => {
  try {
    const projectsPath = getCompanionProjectsPath();
    
    if (!fs.existsSync(projectsPath)) {
      return [];
    }
    
    const files = fs.readdirSync(projectsPath);
    const projects = [];
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          const filePath = path.join(projectsPath, file);
          const data = fs.readFileSync(filePath, 'utf-8');
          const project = JSON.parse(data);
          
          projects.push({
            id: project.id,
            name: project.name,
            avcFileName: path.basename(project.avcFilePath),
            avcFilePath: project.avcFilePath,
            createdAt: project.createdAt,
            lastOpened: project.lastOpened,
            cueCount: project.cues ? project.cues.length : 0
          });
        } catch (error) {
          console.error(`Error reading project ${file}:`, error);
        }
      }
    }
    
    // Sort by lastOpened (most recent first)
    projects.sort((a, b) => new Date(b.lastOpened) - new Date(a.lastOpened));
    
    return projects;
  } catch (error) {
    console.error('Error listing projects:', error);
    return [];
  }
});

ipcMain.handle('delete-companion-project', async (event, projectId) => {
  try {
    const projectsPath = getCompanionProjectsPath();
    const filePath = path.join(projectsPath, `${projectId}.json`);
    
    if (!fs.existsSync(filePath)) {
      return { success: false, error: 'Project not found' };
    }
    
    fs.unlinkSync(filePath);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
