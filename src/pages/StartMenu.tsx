import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { FileText, FolderOpen, Plus, Clock, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { projectStorage } from "@/lib/projectStorage";
import { ProjectMetadata } from "@/types/electron";
import { NewProjectDialog } from "@/components/project/NewProjectDialog";
import { OpenProjectDialog } from "@/components/project/OpenProjectDialog";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";

const StartMenu = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [recentProjects, setRecentProjects] = useState<ProjectMetadata[]>([]);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [showOpenProjectDialog, setShowOpenProjectDialog] = useState(false);

  useEffect(() => {
    loadRecentProjects();
  }, []);

  const loadRecentProjects = async () => {
    const projects = await projectStorage.listProjects();
    setRecentProjects(projects.slice(0, 5)); // Show only 5 most recent
  };

  const handleOpenProject = (projectId: string) => {
    navigate(`/workspace?project=${projectId}`);
  };

  const handleLaunchArena = async (e: React.MouseEvent, avcPath: string, avcFileName: string) => {
    e.stopPropagation();
    if (window.electronAPI) {
      const result = await window.electronAPI.launchArenaComposition(avcPath);
      if (result.success) {
        toast({
          title: "Success",
          description: `Launched ${avcFileName}`
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to launch Arena composition",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Not Available",
        description: "Arena launching requires Electron environment",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-3">Resolume Companion</h1>
          <p className="text-muted-foreground text-lg">Professional cue management for Resolume Arena</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card 
            className="bg-surface border-border hover:border-primary transition-all cursor-pointer p-8 flex flex-col items-center justify-center space-y-4 group"
            onClick={() => setShowNewProjectDialog(true)}
          >
            <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground mb-1">New Project</h3>
              <p className="text-sm text-muted-foreground">Create a new composition</p>
            </div>
          </Card>

          <Card 
            className="bg-surface border-border hover:border-primary transition-all cursor-pointer p-8 flex flex-col items-center justify-center space-y-4 group"
            onClick={() => setShowOpenProjectDialog(true)}
          >
            <div className="w-16 h-16 rounded-lg bg-surface-elevated flex items-center justify-center group-hover:bg-muted transition-colors">
              <FolderOpen className="w-8 h-8 text-foreground" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground mb-1">Open Project</h3>
              <p className="text-sm text-muted-foreground">Browse compositions</p>
            </div>
          </Card>

          <Card 
            className="bg-surface border-border hover:border-primary transition-all cursor-pointer p-8 flex flex-col items-center justify-center space-y-4 group"
          >
            <div className="w-16 h-16 rounded-lg bg-surface-elevated flex items-center justify-center group-hover:bg-muted transition-colors">
              <FileText className="w-8 h-8 text-foreground" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground mb-1">Templates</h3>
              <p className="text-sm text-muted-foreground">Start from a template</p>
            </div>
          </Card>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Recent Projects</h2>
          </div>
          {recentProjects.length === 0 ? (
            <Card className="bg-surface border-border p-12 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">No recent projects</p>
              <p className="text-sm text-muted-foreground">Create a new project to get started</p>
            </Card>
          ) : (
            <Card className="bg-surface border-border divide-y divide-border">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 hover:bg-surface-elevated transition-colors cursor-pointer flex items-center justify-between group"
                  onClick={() => handleOpenProject(project.id)}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground font-medium group-hover:text-primary transition-colors">
                        {project.name}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{formatDistanceToNow(new Date(project.lastOpened), { addSuffix: true })}</span>
                        <span>{project.cueCount} {project.cueCount === 1 ? 'cue' : 'cues'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground max-w-xs truncate">{project.avcFileName}</p>
                    {window.electronAPI && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleLaunchArena(e, project.avcFilePath, project.avcFileName)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>

      <NewProjectDialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog} />
      <OpenProjectDialog open={showOpenProjectDialog} onOpenChange={setShowOpenProjectDialog} />
    </div>
  );
};

export default StartMenu;
