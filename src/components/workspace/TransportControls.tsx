import { Button } from "@/components/ui/button";
import { Play, Square, SkipForward, RotateCcw } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const TransportControls = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="h-20 bg-surface border-t border-border flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <Button
          size="lg"
          className={cn(
            "h-12 w-12 rounded-full",
            isPlaying ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"
          )}
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? <Square className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </Button>
        
        <Button
          size="lg"
          variant="outline"
          className="h-10 w-10 border-border hover:bg-muted"
        >
          <SkipForward className="w-4 h-4" />
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="h-10 w-10 border-border hover:bg-muted"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-sm">
          <span className="text-muted-foreground">Current: </span>
          <span className="text-foreground font-mono">1.0</span>
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground">Time: </span>
          <span className="text-foreground font-mono">00:00.00</span>
        </div>
        <div className="text-sm">
          <span className={cn(
            "px-2 py-1 rounded text-xs font-medium",
            isPlaying ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
          )}>
            {isPlaying ? "PLAYING" : "STOPPED"}
          </span>
        </div>
      </div>
    </div>
  );
};
