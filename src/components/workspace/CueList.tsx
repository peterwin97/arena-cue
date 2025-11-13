import { Button } from "@/components/ui/button";
import { Plus, Trash2, Circle } from "lucide-react";
import { Cue } from "@/pages/Workspace";
import { cn } from "@/lib/utils";

interface CueListProps {
  cues: Cue[];
  selectedCue: Cue | null;
  onSelectCue: (cue: Cue) => void;
  onAddCue: () => void;
  onDeleteCue: (id: string) => void;
}

export const CueList = ({ cues, selectedCue, onSelectCue, onAddCue, onDeleteCue }: CueListProps) => {
  return (
    <div className="w-80 bg-surface border-r border-border flex flex-col">
      <div className="h-12 border-b border-border flex items-center justify-between px-4">
        <h2 className="text-sm font-semibold text-foreground">Cue List</h2>
        <Button
          size="icon"
          variant="ghost"
          onClick={onAddCue}
          className="h-8 w-8 hover:bg-muted"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {cues.map((cue) => (
          <div
            key={cue.id}
            className={cn(
              "group px-4 py-3 border-b border-border cursor-pointer transition-colors",
              selectedCue?.id === cue.id
                ? "bg-primary/10 border-l-2 border-l-primary"
                : "hover:bg-surface-elevated"
            )}
            onClick={() => onSelectCue(cue)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Circle
                    className={cn(
                      "w-3 h-3 flex-shrink-0",
                      cue.armed ? "fill-primary text-primary" : "text-muted-foreground"
                    )}
                  />
                  <span className="text-xs font-mono text-muted-foreground">{cue.number}</span>
                  <span className={cn(
                    "text-sm font-medium truncate",
                    selectedCue?.id === cue.id ? "text-primary" : "text-foreground"
                  )}>
                    {cue.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 ml-5">
                  <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                    {cue.type}
                  </span>
                  {cue.target && (
                    <span className="text-xs text-muted-foreground truncate">{cue.target}</span>
                  )}
                </div>
              </div>
              
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteCue(cue.id);
                }}
                className="h-7 w-7 opacity-0 group-hover:opacity-100 hover:bg-destructive/20 hover:text-destructive"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
