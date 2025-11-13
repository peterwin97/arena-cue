import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Trash2, Clock, Film } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { projectStorage } from "@/lib/projectStorage";
import { useNavigate } from "react-router-dom";
import { ProjectMetadata } from "@/types/electron";
import { formatDistanceToNow } from "date-fns";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface OpenProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OpenProjectDialog = ({ open, onOpenChange }: OpenProjectDialogProps) => {
  const [projects, setProjects] = useState<ProjectMetadata[]>([]);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      loadProjects();
    }
  }, [open]);

  const loadProjects = async () => {
    const projectList = await projectStorage.listProjects();
    setProjects(projectList);
  };

  const handleOpenProject = (projectId: string) => {
    onOpenChange(false);
    navigate(`/workspace?project=${projectId}`);
  };

  const handleDeleteClick = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    setDeleteProjectId(projectId);
  };

  const handleConfirmDelete = async () => {
    if (!deleteProjectId) return;

    const success = await projectStorage.deleteProject(deleteProjectId);
    
    if (success) {
      toast({
        title: "Success",
        description: "Project deleted successfully"
      });
      loadProjects();
    } else {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive"
      });
    }
    
    setDeleteProjectId(null);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Open Project</DialogTitle>
            <DialogDescription>
              Select a project to continue working on
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 overflow-y-auto max-h-[60vh]">
            {projects.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No projects found</p>
                <p className="text-sm text-muted-foreground mt-2">Create a new project to get started</p>
              </div>
            ) : (
              projects.map((project) => (
                <Card
                  key={project.id}
                  className="p-4 cursor-pointer hover:bg-accent transition-colors group"
                  onClick={() => handleOpenProject(project.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {project.name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <div className="flex items-center gap-1">
                              <Film className="w-3 h-3" />
                              <span>{project.avcFileName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>
                                {formatDistanceToNow(new Date(project.lastOpened), { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground ml-13">
                        {project.cueCount} {project.cueCount === 1 ? 'cue' : 'cues'}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleDeleteClick(e, project.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteProjectId} onOpenChange={() => setDeleteProjectId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
              The Arena composition file will not be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
