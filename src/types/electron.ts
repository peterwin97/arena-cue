export interface ProjectMetadata {
  id: string;
  name: string;
  avcFilePath: string;
  avcFileName: string;
  createdAt: string;
  lastOpened: string;
  cueCount: number;
}

export interface AvcFileInfo {
  name: string;
  path: string;
}

export interface ElectronAPI {
  selectFile: () => Promise<string | null>;
  saveProject: (data: any) => Promise<{ success: boolean; path?: string }>;
  loadProject: (filePath: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  browseAvcFile: () => Promise<string | null>;
  listAvcFiles: () => Promise<AvcFileInfo[]>;
  createAvcFile: (name: string) => Promise<{ success: boolean; path?: string; error?: string }>;
  launchArenaComposition: (avcPath: string) => Promise<{ success: boolean; error?: string }>;
  getProjectsPath: () => Promise<string>;
  saveCompanionProject: (project: any) => Promise<{ success: boolean; path?: string; id?: string; error?: string }>;
  loadCompanionProject: (projectId: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  listCompanionProjects: () => Promise<ProjectMetadata[]>;
  deleteCompanionProject: (projectId: string) => Promise<{ success: boolean; error?: string }>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {};
