import { useState } from "react";
import { CueList } from "@/components/workspace/CueList";
import { Inspector } from "@/components/workspace/Inspector";
import { TransportControls } from "@/components/workspace/TransportControls";
import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader";

export interface Cue {
  id: string;
  number: string;
  name: string;
  type: "clip" | "column" | "group";
  target?: string;
  duration?: number;
  armed: boolean;
  notes?: string;
}

const Workspace = () => {
  const [cues, setCues] = useState<Cue[]>([
    { id: "1", number: "1", name: "Opening Sequence", type: "column", target: "Column 1", armed: true },
    { id: "2", number: "2", name: "Main Beat Drop", type: "clip", target: "Column 2, Clip 3", armed: true },
    { id: "3", number: "3", name: "Visual Break", type: "column", target: "Column 3", armed: false },
    { id: "4", number: "4", name: "Finale", type: "group", armed: false },
  ]);

  const [selectedCue, setSelectedCue] = useState<Cue | null>(cues[0]);

  const handleAddCue = () => {
    const newCue: Cue = {
      id: Date.now().toString(),
      number: (cues.length + 1).toString(),
      name: `New Cue ${cues.length + 1}`,
      type: "clip",
      armed: false,
    };
    setCues([...cues, newCue]);
    setSelectedCue(newCue);
  };

  const handleDeleteCue = (id: string) => {
    setCues(cues.filter(cue => cue.id !== id));
    if (selectedCue?.id === id) {
      setSelectedCue(null);
    }
  };

  const handleUpdateCue = (updatedCue: Cue) => {
    setCues(cues.map(cue => cue.id === updatedCue.id ? updatedCue : cue));
    setSelectedCue(updatedCue);
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      <WorkspaceHeader projectName="Summer Festival 2024" />
      
      <div className="flex-1 flex overflow-hidden">
        <CueList
          cues={cues}
          selectedCue={selectedCue}
          onSelectCue={setSelectedCue}
          onAddCue={handleAddCue}
          onDeleteCue={handleDeleteCue}
        />
        
        <div className="flex-1 bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="text-6xl font-bold text-muted-foreground/20">RESOLUME</div>
            <p className="text-muted-foreground">Workspace Preview Area</p>
            {selectedCue && (
              <div className="mt-8 p-6 bg-surface border border-border rounded-lg inline-block">
                <p className="text-sm text-muted-foreground mb-2">Active Cue</p>
                <p className="text-2xl font-semibold text-primary">
                  {selectedCue.number}. {selectedCue.name}
                </p>
              </div>
            )}
          </div>
        </div>
        
        <Inspector selectedCue={selectedCue} onUpdateCue={handleUpdateCue} />
      </div>
      
      <TransportControls />
    </div>
  );
};

export default Workspace;
