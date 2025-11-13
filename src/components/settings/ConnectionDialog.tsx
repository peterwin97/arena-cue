import { useState, useEffect } from "react";
import { Settings, RotateCcw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResolume } from "@/contexts/ResolumeContext";
import { ConnectionStatusIndicator } from "./ConnectionStatusIndicator";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

interface ConnectionDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ConnectionDialog({ trigger, open, onOpenChange }: ConnectionDialogProps) {
  const { 
    connectionStatus, 
    connectionSettings, 
    errorMessage,
    testConnection, 
    updateConnection 
  } = useResolume();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [host, setHost] = useState(connectionSettings.host);
  const [port, setPort] = useState(connectionSettings.port.toString());
  const [autoReconnect, setAutoReconnect] = useState(connectionSettings.autoReconnect);
  const [isTesting, setIsTesting] = useState(false);

  // Sync with external open state if provided
  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  // Reset form when opening
  useEffect(() => {
    if (isOpen) {
      setHost(connectionSettings.host);
      setPort(connectionSettings.port.toString());
      setAutoReconnect(connectionSettings.autoReconnect);
    }
  }, [isOpen, connectionSettings]);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  const handleTestConnection = async () => {
    // Validate inputs
    const portNum = parseInt(port);
    if (!host.trim()) {
      toast({
        title: "Validation Error",
        description: "Host cannot be empty",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
      toast({
        title: "Validation Error",
        description: "Port must be a number between 1 and 65535",
        variant: "destructive",
      });
      return;
    }

    setIsTesting(true);
    const success = await updateConnection(host.trim(), portNum);
    setIsTesting(false);

    if (success) {
      toast({
        title: "Connected",
        description: `Successfully connected to Resolume Arena at ${host}:${port}`,
      });
    } else {
      toast({
        title: "Connection Failed",
        description: errorMessage || "Could not connect to Resolume Arena. Make sure it's running and the REST API is enabled.",
        variant: "destructive",
      });
    }
  };

  const handleResetDefaults = () => {
    setHost('localhost');
    setPort('8080');
    setAutoReconnect(true);
  };

  const formatLastConnected = () => {
    if (!connectionSettings.lastConnected) return 'Never';
    
    try {
      const date = new Date(connectionSettings.lastConnected);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } catch {
      return 'Unknown';
    }
  };

  const dialogContent = (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Resolume Connection Settings</DialogTitle>
        <DialogDescription>
          Configure the connection to Resolume Arena's REST API.
          {!(window as any).electronAPI && (
            <span className="block mt-2 text-xs text-muted-foreground">
              Browser mode: Using proxy server to connect to Resolume
            </span>
          )}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="host">Host</Label>
          <Input
            id="host"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            placeholder="192.168.0.32"
          />
          <p className="text-xs text-muted-foreground">
            Use your computer's local IP address (e.g., 192.168.0.32) or localhost
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="port">Port</Label>
          <Input
            id="port"
            type="number"
            min="1"
            max="65535"
            value={port}
            onChange={(e) => setPort(e.target.value)}
            placeholder="8080"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="autoReconnect"
            checked={autoReconnect}
            onCheckedChange={(checked) => setAutoReconnect(checked as boolean)}
          />
          <Label
            htmlFor="autoReconnect"
            className="text-sm font-normal cursor-pointer"
          >
            Automatically reconnect on startup
          </Label>
        </div>

        <div className="pt-2">
          <ConnectionStatusIndicator
            status={isTesting ? 'connecting' : connectionStatus}
            host={connectionSettings.host}
            port={connectionSettings.port}
            showLabel={true}
          />
          {errorMessage && connectionStatus === 'error' && (
            <p className="text-sm text-destructive mt-2">{errorMessage}</p>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          Last connected: {formatLastConnected()}
        </div>
      </div>

      <DialogFooter className="flex-col sm:flex-row gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleResetDefaults}
          className="w-full sm:w-auto"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button
          type="button"
          onClick={handleTestConnection}
          disabled={isTesting}
          className="w-full sm:w-auto"
        >
          {isTesting ? 'Testing...' : 'Test & Save'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );

  if (trigger) {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        {dialogContent}
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {dialogContent}
    </Dialog>
  );
}

// Export a simple trigger button variant
export function ConnectionDialogButton() {
  return (
    <ConnectionDialog
      trigger={
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Connection Settings
        </Button>
      }
    />
  );
}
