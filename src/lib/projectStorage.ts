import { Cue } from "@/pages/Workspace";
import { ProjectMetadata } from "@/types/electron";

export interface CompanionProject {
  id: string;
  name: string;
  avcFilePath: string;
  avcFileName: string;
  createdAt: string;
  lastOpened: string;
  cues: Cue[];
  resolumeHost: string;
  resolumePort: number;
}

class ProjectStorage {
  private isElectron(): boolean {
    return typeof window !== 'undefined' && !!window.electronAPI;
  }

  async saveProject(project: CompanionProject): Promise<{ success: boolean; id?: string; error?: string }> {
    if (this.isElectron()) {
      return window.electronAPI!.saveCompanionProject(project);
    } else {
      // Web fallback: use localStorage
      try {
        const projects = this.getLocalStorageProjects();
        const existingIndex = projects.findIndex(p => p.id === project.id);
        
        if (existingIndex >= 0) {
          projects[existingIndex] = project;
        } else {
          projects.push(project);
        }
        
        localStorage.setItem('companion-projects', JSON.stringify(projects));
        return { success: true, id: project.id };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    }
  }

  async loadProject(projectId: string): Promise<CompanionProject | null> {
    if (this.isElectron()) {
      const result = await window.electronAPI!.loadCompanionProject(projectId);
      return result.success ? result.data : null;
    } else {
      // Web fallback
      const projects = this.getLocalStorageProjects();
      return projects.find(p => p.id === projectId) || null;
    }
  }

  async listProjects(): Promise<ProjectMetadata[]> {
    if (this.isElectron()) {
      return window.electronAPI!.listCompanionProjects();
    } else {
      // Web fallback
      const projects = this.getLocalStorageProjects();
      return projects.map(p => ({
        id: p.id,
        name: p.name,
        avcFileName: p.avcFileName,
        avcFilePath: p.avcFilePath,
        createdAt: p.createdAt,
        lastOpened: p.lastOpened,
        cueCount: p.cues.length
      }));
    }
  }

  async deleteProject(projectId: string): Promise<boolean> {
    if (this.isElectron()) {
      const result = await window.electronAPI!.deleteCompanionProject(projectId);
      return result.success;
    } else {
      // Web fallback
      try {
        const projects = this.getLocalStorageProjects();
        const filtered = projects.filter(p => p.id !== projectId);
        localStorage.setItem('companion-projects', JSON.stringify(filtered));
        return true;
      } catch {
        return false;
      }
    }
  }

  async createProject(name: string, avcPath: string): Promise<CompanionProject> {
    const project: CompanionProject = {
      id: this.generateId(),
      name,
      avcFilePath: avcPath,
      avcFileName: avcPath.split(/[\\/]/).pop() || 'unknown.avc',
      createdAt: new Date().toISOString(),
      lastOpened: new Date().toISOString(),
      cues: [],
      resolumeHost: 'localhost',
      resolumePort: 8080
    };

    await this.saveProject(project);
    return project;
  }

  async updateLastOpened(projectId: string): Promise<void> {
    const project = await this.loadProject(projectId);
    if (project) {
      project.lastOpened = new Date().toISOString();
      await this.saveProject(project);
    }
  }

  private getLocalStorageProjects(): CompanionProject[] {
    try {
      const data = localStorage.getItem('companion-projects');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const projectStorage = new ProjectStorage();
