import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cue } from "@/pages/Workspace";
import { formatTime, parseTime } from "@/lib/timeUtils";

interface InspectorProps {
  selectedCue: Cue | null;
  onUpdateCue: (cue: Cue) => void;
}

export const Inspector = ({ selectedCue, onUpdateCue }: InspectorProps) => {
  if (!selectedCue) {
    return (
      <div className="h-64 bg-surface border-t border-border flex items-center justify-center">
        <p className="text-muted-foreground text-sm">No cue selected</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border-t border-border">
      <Tabs defaultValue="basics" className="w-full">
        <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent h-10 px-4">
          <TabsTrigger value="basics" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
            Basics
          </TabsTrigger>
          <TabsTrigger value="triggers" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
            Triggers
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basics" className="p-4 space-y-0">
          <div className="grid grid-cols-4 gap-4">
            {/* Left column */}
            <div className="space-y-3">
              <div>
                <Label htmlFor="cue-number" className="text-xs text-muted-foreground">Number</Label>
                <Input
                  id="cue-number"
                  value={selectedCue.number}
                  onChange={(e) => onUpdateCue({ ...selectedCue, number: e.target.value })}
                  className="mt-1 h-8 bg-input border-border"
                />
              </div>

              <div>
                <Label htmlFor="pre-wait" className="text-xs text-muted-foreground">Pre Wait</Label>
                <Input
                  id="pre-wait"
                  value={formatTime(selectedCue.preWait)}
                  onChange={(e) => onUpdateCue({ ...selectedCue, preWait: parseTime(e.target.value) })}
                  className="mt-1 h-8 bg-input border-border font-mono text-xs"
                />
              </div>

              <div>
                <Label htmlFor="duration" className="text-xs text-muted-foreground">Duration</Label>
                <Input
                  id="duration"
                  value={formatTime(selectedCue.duration)}
                  onChange={(e) => onUpdateCue({ ...selectedCue, duration: parseTime(e.target.value) })}
                  className="mt-1 h-8 bg-input border-border font-mono text-xs"
                />
              </div>

              <div>
                <Label htmlFor="post-wait" className="text-xs text-muted-foreground">Post Wait</Label>
                <Input
                  id="post-wait"
                  value={formatTime(selectedCue.postWait)}
                  onChange={(e) => onUpdateCue({ ...selectedCue, postWait: parseTime(e.target.value) })}
                  className="mt-1 h-8 bg-input border-border font-mono text-xs"
                />
              </div>
            </div>

            {/* Center-left column */}
            <div className="space-y-3">
              <div>
                <Label htmlFor="cue-name" className="text-xs text-muted-foreground">Name</Label>
                <Input
                  id="cue-name"
                  value={selectedCue.name}
                  onChange={(e) => onUpdateCue({ ...selectedCue, name: e.target.value })}
                  className="mt-1 h-8 bg-input border-border"
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
                  <SelectTrigger className="mt-1 h-8 bg-input border-border">
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
                  className="mt-1 h-8 bg-input border-border"
                />
              </div>
            </div>

            {/* Center-right column */}
            <div className="space-y-3">
              <div>
                <Label htmlFor="continue" className="text-xs text-muted-foreground">Continue Mode</Label>
                <Select
                  value={selectedCue.continue ? "auto" : "manual"}
                  onValueChange={(value) => onUpdateCue({ ...selectedCue, continue: value === "auto" })}
                >
                  <SelectTrigger className="mt-1 h-8 bg-input border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Do not continue</SelectItem>
                    <SelectItem value="auto">Auto-continue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="color" className="text-xs text-muted-foreground">Color</Label>
                <Input
                  id="color"
                  type="color"
                  value={selectedCue.color || "#000000"}
                  onChange={(e) => onUpdateCue({ ...selectedCue, color: e.target.value })}
                  className="mt-1 h-8 bg-input border-border"
                />
              </div>
            </div>

            {/* Right column - Checkboxes */}
            <div className="space-y-3">
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
          </div>

          {/* Notes section - full width below */}
          <div className="mt-4 pt-4 border-t border-border">
            <Label htmlFor="notes" className="text-xs text-muted-foreground">Notes</Label>
            <Textarea
              id="notes"
              value={selectedCue.notes || ""}
              onChange={(e) => onUpdateCue({ ...selectedCue, notes: e.target.value })}
              placeholder="Add notes about this cue..."
              className="mt-1 bg-input border-border min-h-[60px] resize-none"
            />
          </div>
        </TabsContent>

        <TabsContent value="triggers" className="p-4">
          <p className="text-sm text-muted-foreground">Trigger settings coming soon...</p>
        </TabsContent>

        <TabsContent value="settings" className="p-4">
          <p className="text-sm text-muted-foreground">Additional settings coming soon...</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};
