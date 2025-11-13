import { useState } from "react";
import { CueList } from "@/components/workspace/CueList";
import { Inspector } from "@/components/workspace/Inspector";
import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader";
import { Toolbar } from "@/components/workspace/Toolbar";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

export interface Cue {
  id: string;
  number: string;
  name: string;
  type: "clip" | "column" | "group";
  target?: string;
  duration?: number;
  armed: boolean;
  notes?: string;
  preWait?: number;
  postWait?: number;
  continue?: boolean;
  color?: string;
  icon?: string;
}

const Workspace = () => {
  const [cues, setCues] = useState<Cue[]>([
    { 
      id: "1", 
      number: "1", 
      name: "Opening Sequence", 
      type: "column", 
      target: "Column 1", 
      armed: true,
      preWait: 0,
      duration: 5.5,
      postWait: 0,
      continue: false
    },
    { 
      id: "2", 
      number: "2", 
      name: "Main Beat Drop", 
      type: "clip", 
      target: "Column 2, Clip 3", 
      armed: true,
      preWait: 2.0,
      duration: 10.25,
      postWait: 1.0,
      continue: true
    },
    { 
      id: "3", 
      number: "3", 
      name: "Visual Break", 
      type: "column", 
      target: "Column 3", 
      armed: false,
      preWait: 0,
      duration: 8.0,
      postWait: 0,
      continue: false
    },
    { 
      id: "4", 
      number: "4", 
      name: "Finale", 
      type: "group", 
      armed: false,
      preWait: 0,
      duration: 15.0,
      postWait: 2.5,
      continue: false
    },
  ]);

  const [selectedCue, setSelectedCue] = useState<Cue | null>(cues[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAddCue = () => {
    const newCue: Cue = {
      id: Date.now().toString(),
      number: (cues.length + 1).toString(),
      name: `New Cue ${cues.length + 1}`,
      type: "clip",
      armed: false,
      preWait: 0,
      duration: 0,
      postWait: 0,
      continue: false,
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

  const handleGo = () => {
    setIsPlaying(!isPlaying);
    console.log("GO pressed! Current cue:", selectedCue?.name);
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      <WorkspaceHeader 
        projectName="Summer Festival 2024" 
        currentCueName={selectedCue?.name}
        onGo={handleGo}
        isPlaying={isPlaying}
      />
      
      <Toolbar />

      <ResizablePanelGroup direction="vertical" className="flex-1">
        <ResizablePanel defaultSize={70} minSize={30}>
          <CueList
            cues={cues}
            selectedCue={selectedCue}
            onSelectCue={setSelectedCue}
            onAddCue={handleAddCue}
            onDeleteCue={handleDeleteCue}
          />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
          <Inspector selectedCue={selectedCue} onUpdateCue={handleUpdateCue} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Workspace;
