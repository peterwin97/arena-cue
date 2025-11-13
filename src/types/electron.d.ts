export interface ElectronAPI {
  selectFile: () => Promise<string | null>;
  saveProject: (data: any) => Promise<{ success: boolean; path?: string }>;
  loadProject: (filePath: string) => Promise<{ success: boolean; data?: any; error?: string }>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
