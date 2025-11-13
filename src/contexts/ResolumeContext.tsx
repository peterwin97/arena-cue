import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ResolumeAPI } from '@/lib/resolumeAPI';
import { getConnectionSettings, saveConnectionSettings, ConnectionSettings } from '@/lib/connectionSettings';

export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

interface ResolumeContextValue {
  resolumeAPI: ResolumeAPI;
  connectionStatus: ConnectionStatus;
  connectionSettings: ConnectionSettings;
  errorMessage?: string;
  testConnection: () => Promise<boolean>;
  updateConnection: (host: string, port: number) => Promise<boolean>;
  disconnect: () => void;
}

const ResolumeContext = createContext<ResolumeContextValue | undefined>(undefined);

export function ResolumeContextProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<ConnectionSettings>(() => getConnectionSettings());
  const [api] = useState(() => new ResolumeAPI(settings.host, settings.port));
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [errorMessage, setErrorMessage] = useState<string>();

  const testConnection = useCallback(async (): Promise<boolean> => {
    setConnectionStatus('connecting');
    setErrorMessage(undefined);

    try {
      const connected = await api.connect();
      
      if (connected) {
        setConnectionStatus('connected');
        const updatedSettings = {
          ...settings,
          lastConnected: new Date().toISOString(),
        };
        setSettings(updatedSettings);
        saveConnectionSettings(updatedSettings);
        return true;
      } else {
        setConnectionStatus('error');
        setErrorMessage('Failed to connect to Resolume Arena');
        return false;
      }
    } catch (error) {
      setConnectionStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }, [api, settings]);

  const updateConnection = useCallback(async (host: string, port: number): Promise<boolean> => {
    api.updateConnection(host, port);
    const newSettings: ConnectionSettings = {
      host,
      port,
      autoReconnect: settings.autoReconnect,
    };
    setSettings(newSettings);
    saveConnectionSettings(newSettings);
    
    return testConnection();
  }, [api, settings.autoReconnect, testConnection]);

  const disconnect = useCallback(() => {
    api.disconnect();
    setConnectionStatus('disconnected');
    setErrorMessage(undefined);
  }, [api]);

  // Auto-connect on mount if autoReconnect is enabled
  useEffect(() => {
    if (settings.autoReconnect && settings.lastConnected) {
      testConnection();
    }
  }, []);

  const value: ResolumeContextValue = {
    resolumeAPI: api,
    connectionStatus,
    connectionSettings: settings,
    errorMessage,
    testConnection,
    updateConnection,
    disconnect,
  };

  return (
    <ResolumeContext.Provider value={value}>
      {children}
    </ResolumeContext.Provider>
  );
}

export function useResolume() {
  const context = useContext(ResolumeContext);
  if (!context) {
    throw new Error('useResolume must be used within ResolumeContextProvider');
  }
  return context;
}
