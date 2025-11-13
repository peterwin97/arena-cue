import { Button } from "@/components/ui/button";
import { Plus, Trash2, Circle, Video, Music, Lightbulb } from "lucide-react";
import { Cue } from "@/pages/Workspace";
import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/timeUtils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CueListProps {
  cues: Cue[];
  selectedCue: Cue | null;
  onSelectCue: (cue: Cue) => void;
  onAddCue: () => void;
  onDeleteCue: (id: string) => void;
}

const getCueIcon = (type: string) => {
  switch (type) {
    case "clip":
      return Video;
    case "column":
      return Lightbulb;
    case "group":
      return Music;
    default:
      return Circle;
  }
};

export const CueList = ({ cues, selectedCue, onSelectCue, onAddCue, onDeleteCue }: CueListProps) => {
  return (
    <div className="flex-1 flex flex-col bg-background overflow-hidden">
      {/* Toolbar */}
      <div className="h-10 border-b border-border flex items-center justify-between px-2">
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={onAddCue}
            className="h-8 w-8 hover:bg-muted"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <span className="text-xs text-muted-foreground">{cues.length} cues</span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-12"></TableHead>
              <TableHead className="w-16">No.</TableHead>
              <TableHead className="min-w-[200px]">Name</TableHead>
              <TableHead className="min-w-[150px]">Target</TableHead>
              <TableHead className="w-24">Pre Wait</TableHead>
              <TableHead className="w-24">Duration</TableHead>
              <TableHead className="w-24">Post Wait</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cues.map((cue) => {
              const Icon = getCueIcon(cue.type);
              const isSelected = selectedCue?.id === cue.id;
              
              return (
                <TableRow
                  key={cue.id}
                  onClick={() => onSelectCue(cue)}
                  className={cn(
                    "cursor-pointer border-border group relative",
                    isSelected && "bg-primary/20 hover:bg-primary/25"
                  )}
                >
                  {/* Color indicator & icon */}
                  <TableCell className="relative">
                    {isSelected && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                    )}
                    <Icon className={cn(
                      "w-4 h-4 ml-2",
                      cue.armed ? "text-primary" : "text-muted-foreground"
                    )} />
                  </TableCell>

                  <TableCell className="font-mono text-xs">{cue.number}</TableCell>
                  
                  <TableCell className={cn(
                    "font-medium",
                    isSelected ? "text-primary" : "text-foreground"
                  )}>
                    {cue.name}
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {cue.target || "-"}
                  </TableCell>

                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {formatTime(cue.preWait)}
                  </TableCell>

                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {formatTime(cue.duration)}
                  </TableCell>

                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {formatTime(cue.postWait)}
                  </TableCell>

                  <TableCell>
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
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
