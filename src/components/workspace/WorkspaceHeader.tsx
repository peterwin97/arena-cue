import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Square, SkipForward, SkipBack, Pause, Settings } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useResolume } from "@/contexts/ResolumeContext";
import { ConnectionStatusIndicator } from "@/components/settings/ConnectionStatusIndicator";
import { ConnectionDialog } from "@/components/settings/ConnectionDialog";

interface WorkspaceHeaderProps {
  projectName: string;
  currentCueName?: string;
  onGo: () => void;
  isPlaying: boolean;
  onSave?: () => void;
  onClose?: () => void;
  hasUnsavedChanges?: boolean;
}

export const WorkspaceHeader = ({ projectName, currentCueName, onGo, isPlaying, onSave, onClose, hasUnsavedChanges }: WorkspaceHeaderProps) => {
  const [editingName, setEditingName] = useState(false);
  const [showConnectionDialog, setShowConnectionDialog] = useState(false);
  const { connectionStatus, connectionSettings } = useResolume();

  return (
    <header className="h-20 bg-surface border-b border-border flex items-center justify-between px-4 gap-4">
      {/* Left: GO Button */}
      <Button
        size="lg"
        onClick={onGo}
        className="h-14 w-24 text-xl font-bold bg-transparent border-2 border-green-500 text-green-500 hover:bg-green-500/20 hover:text-green-400"
      >
        GO
      </Button>

      {/* Center: Project info */}
      <div className="flex-1 flex flex-col gap-1">
        <div className="text-xs text-muted-foreground">{projectName}</div>
        {editingName ? (
          <Input
            value={currentCueName || ""}
            onBlur={() => setEditingName(false)}
            autoFocus
            className="h-8 bg-input border-border"
          />
        ) : (
          <div
            className="text-sm font-medium text-foreground cursor-pointer hover:text-primary"
            onClick={() => setEditingName(true)}
          >
            {currentCueName || "No cue selected"}
          </div>
        )}
      </div>

      {/* Right: Transport Controls */}
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="ghost"
          className="h-10 w-10 hover:bg-muted"
        >
          <SkipBack className="w-5 h-5" />
        </Button>

        {isPlaying ? (
          <Button
            size="icon"
            variant="ghost"
            className="h-10 w-10 hover:bg-muted"
          >
            <Pause className="w-5 h-5" />
          </Button>
        ) : (
          <Button
            size="icon"
            variant="ghost"
            className="h-10 w-10 hover:bg-muted"
          >
            <Play className="w-5 h-5" />
          </Button>
        )}

        <Button
          size="icon"
          variant="ghost"
          className="h-10 w-10 hover:bg-muted"
        >
          <Square className="w-5 h-5" />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          className="h-10 w-10 hover:bg-muted"
        >
          <SkipForward className="w-5 h-5" />
        </Button>

        <div className="ml-4 text-sm">
          <span className="text-muted-foreground">Time: </span>
          <span className="text-foreground font-mono">00:00.00</span>
        </div>

        <ConnectionStatusIndicator
          status={connectionStatus}
          host={connectionSettings.host}
          port={connectionSettings.port}
          onClick={() => setShowConnectionDialog(true)}
          className="ml-4"
        />

        {onSave && (
          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
            className="ml-4"
          >
            {hasUnsavedChanges ? "Save*" : "Save"}
          </Button>
        )}

        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="ml-2"
          >
            Close
          </Button>
        )}
      </div>

      <ConnectionDialog
        open={showConnectionDialog}
        onOpenChange={setShowConnectionDialog}
      />
    </header>
  );
};
