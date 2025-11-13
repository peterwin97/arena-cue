import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CueList } from "@/components/workspace/CueList";
import { Inspector } from "@/components/workspace/Inspector";
import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader";
import { Toolbar } from "@/components/workspace/Toolbar";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { projectStorage, CompanionProject } from "@/lib/projectStorage";
import { useToast } from "@/hooks/use-toast";

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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentProject, setCurrentProject] = useState<CompanionProject | null>(null);
  const [cues, setCues] = useState<Cue[]>([]);
  const [selectedCue, setSelectedCue] = useState<Cue | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const projectId = searchParams.get('project');
    if (projectId) {
      loadProject(projectId);
    }
  }, [searchParams]);

  const loadProject = async (projectId: string) => {
    const project = await projectStorage.loadProject(projectId);
    if (project) {
      setCurrentProject(project);
      setCues(project.cues);
      if (project.cues.length > 0) {
        setSelectedCue(project.cues[0]);
      }
      
      await projectStorage.updateLastOpened(projectId);

      // Launch Arena composition if linked
      if (window.electronAPI && project.avcFilePath) {
        const result = await window.electronAPI.launchArenaComposition(project.avcFilePath);
        if (result.success) {
          toast({
            title: "Arena Launched",
            description: `Opened ${project.avcFileName}`
          });
        }
      }
    } else {
      toast({
        title: "Error",
        description: "Project not found",
        variant: "destructive"
      });
      navigate('/');
    }
  };

  const saveCurrentProject = useCallback(async () => {
    if (!currentProject) return;

    const updated: CompanionProject = {
      ...currentProject,
      cues,
      lastOpened: new Date().toISOString()
    };

    const result = await projectStorage.saveProject(updated);
    if (result.success) {
      setHasUnsavedChanges(false);
      setCurrentProject(updated);
    }
  }, [currentProject, cues]);

  useEffect(() => {
    if (currentProject && cues.length > 0) {
      setHasUnsavedChanges(true);
      const timeoutId = setTimeout(() => {
        saveCurrentProject();
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [cues, currentProject, saveCurrentProject]);

  const handleCloseProject = () => {
    if (hasUnsavedChanges) {
      saveCurrentProject();
    }
    navigate('/');
  };

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

  if (!currentProject) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading project...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      <WorkspaceHeader 
        projectName={currentProject.name}
        currentCueName={selectedCue?.name}
        onGo={handleGo}
        isPlaying={isPlaying}
        onSave={saveCurrentProject}
        onClose={handleCloseProject}
        hasUnsavedChanges={hasUnsavedChanges}
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
