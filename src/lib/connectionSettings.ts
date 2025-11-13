export interface ConnectionSettings {
  host: string;
  port: number;
  lastConnected?: string;
  autoReconnect: boolean;
}

const SETTINGS_KEY = 'resolume-connection-settings';
const VERSION_KEY = 'resolume-connection-version';
const CURRENT_VERSION = '1.0';

const DEFAULT_SETTINGS: ConnectionSettings = {
  host: 'localhost',
  port: 8080,
  autoReconnect: true,
};

export function getConnectionSettings(): ConnectionSettings {
  try {
    const version = localStorage.getItem(VERSION_KEY);
    
    // Handle version migrations if needed
    if (version !== CURRENT_VERSION) {
      // For now, just update the version
      localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
    }

    const stored = localStorage.getItem(SETTINGS_KEY);
    if (!stored) {
      return { ...DEFAULT_SETTINGS };
    }

    const parsed = JSON.parse(stored) as ConnectionSettings;
    
    // Validate and merge with defaults
    return {
      host: parsed.host || DEFAULT_SETTINGS.host,
      port: parsed.port || DEFAULT_SETTINGS.port,
      lastConnected: parsed.lastConnected,
      autoReconnect: parsed.autoReconnect ?? DEFAULT_SETTINGS.autoReconnect,
    };
  } catch (error) {
    console.error('Failed to load connection settings:', error);
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveConnectionSettings(settings: ConnectionSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
  } catch (error) {
    console.error('Failed to save connection settings:', error);
  }
}

export function clearConnectionSettings(): void {
  try {
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(VERSION_KEY);
  } catch (error) {
    console.error('Failed to clear connection settings:', error);
  }
}
