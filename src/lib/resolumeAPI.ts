export interface ResolumeClip {
  id: number;
  name: string;
  thumbnail?: string;
  duration?: number;
}

export interface ResolumeLayer {
  id: number;
  name: string;
  clips: ResolumeClip[];
}

export interface ResolumeComposition {
  layers: ResolumeLayer[];
  columns: number;
}

export interface CueTarget {
  layerId: number;
  clipId: number;
  transitionTime?: number;
}

export class ResolumeAPI {
  private host: string = 'localhost';
  private port: number = 8080;
  private baseUrl: string = '';
  private isConnected: boolean = false;
  private useProxy: boolean = false;

  constructor(host: string = 'localhost', port: number = 8080) {
    this.host = host;
    this.port = port;
    // Detect if running in browser (not Electron) - use proxy server
    this.useProxy = typeof window !== 'undefined' && !(window as any).electronAPI;
    this.updateBaseUrl();
  }

  private updateBaseUrl(): void {
    if (this.useProxy) {
      // Use the proxy server endpoint
      this.baseUrl = '/api/resolume/proxy';
    } else {
      // Direct connection (Electron or Node)
      this.baseUrl = `http://${this.host}:${this.port}/api/v1`;
    }
  }

  private async updateProxyTarget(): Promise<void> {
    if (this.useProxy) {
      try {
        await fetch('/api/resolume/connection', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ host: this.host, port: this.port })
        });
      } catch (error) {
        console.error('Failed to update proxy target:', error);
      }
    }
  }

  async connect(): Promise<boolean> {
    try {
      // Update proxy target if using proxy
      await this.updateProxyTarget();

      const response = await fetch(`${this.baseUrl}/composition`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        this.isConnected = true;
        return true;
      }
      
      this.isConnected = false;
      return false;
    } catch (error) {
      console.error('Failed to connect to Resolume Arena:', error);
      this.isConnected = false;
      return false;
    }
  }

  disconnect(): void {
    this.isConnected = false;
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  updateConnection(host: string, port: number): void {
    this.host = host;
    this.port = port;
    this.updateBaseUrl();
    this.isConnected = false;
  }

  async getComposition(): Promise<ResolumeComposition | null> {
    if (!this.isConnected) {
      throw new Error('Not connected to Resolume Arena');
    }

    try {
      const response = await fetch(`${this.baseUrl}/composition`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch composition: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Parse Resolume composition structure
      const layers: ResolumeLayer[] = data.layers?.map((layer: any, index: number) => ({
        id: layer.id || index + 1,
        name: layer.name || `Layer ${index + 1}`,
        clips: layer.clips?.map((clip: any, clipIndex: number) => ({
          id: clip.id || clipIndex + 1,
          name: clip.name || `Clip ${clipIndex + 1}`,
          duration: clip.duration,
        })) || [],
      })) || [];

      return {
        layers,
        columns: data.columns || 0,
      };
    } catch (error) {
      console.error('Error fetching composition:', error);
      return null;
    }
  }

  async getThumbnail(layerId: number, clipId: number): Promise<string | null> {
    if (!this.isConnected) {
      throw new Error('Not connected to Resolume Arena');
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/composition/layers/${layerId}/clips/${clipId}/thumbnail`,
        {
          method: 'GET',
          headers: {
            'Accept': 'image/jpeg, image/png',
          },
        }
      );

      if (!response.ok) {
        console.warn(`Failed to fetch thumbnail for Layer ${layerId}, Clip ${clipId}`);
        return null;
      }

      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error(`Error fetching thumbnail for Layer ${layerId}, Clip ${clipId}:`, error);
      return null;
    }
  }

  async triggerClip(layerId: number, clipId: number, transitionTime?: number): Promise<boolean> {
    if (!this.isConnected) {
      throw new Error('Not connected to Resolume Arena');
    }

    try {
      // Set transition time first if provided
      if (transitionTime !== undefined) {
        await this.setLayerTransitionTime(layerId, transitionTime);
      }

      // Trigger the clip by connecting it
      const response = await fetch(
        `${this.baseUrl}/composition/layers/${layerId}/clips/${clipId}/connect`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.ok;
    } catch (error) {
      console.error(`Error triggering clip Layer ${layerId}, Clip ${clipId}:`, error);
      return false;
    }
  }

  async triggerMultipleLayers(targets: CueTarget[]): Promise<boolean[]> {
    if (!this.isConnected) {
      throw new Error('Not connected to Resolume Arena');
    }

    // Execute all triggers in parallel
    const triggers = targets.map(target =>
      this.triggerClip(target.layerId, target.clipId, target.transitionTime)
    );

    return Promise.all(triggers);
  }

  async setLayerTransitionTime(layerId: number, timeInSeconds: number): Promise<boolean> {
    if (!this.isConnected) {
      throw new Error('Not connected to Resolume Arena');
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/composition/layers/${layerId}/video/mixer/transition/time`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ value: timeInSeconds }),
        }
      );

      return response.ok;
    } catch (error) {
      console.error(`Error setting transition time for Layer ${layerId}:`, error);
      return false;
    }
  }

  async clearLayer(layerId: number): Promise<boolean> {
    if (!this.isConnected) {
      throw new Error('Not connected to Resolume Arena');
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/composition/layers/${layerId}/clear`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.ok;
    } catch (error) {
      console.error(`Error clearing Layer ${layerId}:`, error);
      return false;
    }
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  getHost(): string {
    return this.host;
  }

  getPort(): number {
    return this.port;
  }
}

// Singleton instance
let resolumeAPIInstance: ResolumeAPI | null = null;

export const getResolumeAPI = (host?: string, port?: number): ResolumeAPI => {
  if (!resolumeAPIInstance) {
    resolumeAPIInstance = new ResolumeAPI(host, port);
  } else if (host && port) {
    resolumeAPIInstance.updateConnection(host, port);
  }
  return resolumeAPIInstance;
};

export const resetResolumeAPI = (): void => {
  resolumeAPIInstance = null;
};
