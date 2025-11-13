import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Cue } from "@/pages/Workspace";

interface InspectorProps {
  selectedCue: Cue | null;
  onUpdateCue: (cue: Cue) => void;
}

export const Inspector = ({ selectedCue, onUpdateCue }: InspectorProps) => {
  if (!selectedCue) {
    return (
      <div className="w-80 bg-surface border-l border-border flex items-center justify-center">
        <p className="text-muted-foreground text-sm">No cue selected</p>
      </div>
    );
  }

  return (
    <div className="w-80 bg-surface border-l border-border flex flex-col">
      <div className="h-12 border-b border-border flex items-center px-4">
        <h2 className="text-sm font-semibold text-foreground">Inspector</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="cue-number" className="text-xs text-muted-foreground">Cue Number</Label>
            <Input
              id="cue-number"
              value={selectedCue.number}
              onChange={(e) => onUpdateCue({ ...selectedCue, number: e.target.value })}
              className="mt-1.5 bg-input border-border"
            />
          </div>

          <div>
            <Label htmlFor="cue-name" className="text-xs text-muted-foreground">Cue Name</Label>
            <Input
              id="cue-name"
              value={selectedCue.name}
              onChange={(e) => onUpdateCue({ ...selectedCue, name: e.target.value })}
              className="mt-1.5 bg-input border-border"
            />
          </div>

          <div>
            <Label htmlFor="cue-type" className="text-xs text-muted-foreground">Type</Label>
            <Select
              value={selectedCue.type}
              onValueChange={(value: "clip" | "column" | "group") =>
                onUpdateCue({ ...selectedCue, type: value })
              }
            >
              <SelectTrigger className="mt-1.5 bg-input border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clip">Clip</SelectItem>
                <SelectItem value="column">Column</SelectItem>
                <SelectItem value="group">Group</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="target" className="text-xs text-muted-foreground">Resolume Target</Label>
            <Input
              id="target"
              value={selectedCue.target || ""}
              onChange={(e) => onUpdateCue({ ...selectedCue, target: e.target.value })}
              placeholder="e.g., Column 1, Clip 3"
              className="mt-1.5 bg-input border-border"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="armed" className="text-xs text-muted-foreground">Armed</Label>
            <Switch
              id="armed"
              checked={selectedCue.armed}
              onCheckedChange={(checked) =>
                onUpdateCue({ ...selectedCue, armed: checked })
              }
            />
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <Label htmlFor="notes" className="text-xs text-muted-foreground">Notes</Label>
          <Textarea
            id="notes"
            value={selectedCue.notes || ""}
            onChange={(e) => onUpdateCue({ ...selectedCue, notes: e.target.value })}
            placeholder="Add notes about this cue..."
            className="mt-1.5 bg-input border-border min-h-[100px]"
          />
        </div>
      </div>
    </div>
  );
};
