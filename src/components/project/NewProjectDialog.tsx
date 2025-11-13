import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { FolderOpen, Plus, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { projectStorage } from "@/lib/projectStorage";
import { useNavigate } from "react-router-dom";
import { AvcFileInfo } from "@/types/electron";

interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewProjectDialog = ({ open, onOpenChange }: NewProjectDialogProps) => {
  const [projectName, setProjectName] = useState("");
  const [selectedAvcPath, setSelectedAvcPath] = useState("");
  const [newCompositionName, setNewCompositionName] = useState("");
  const [useProjectNameForAvc, setUseProjectNameForAvc] = useState(true);
  const [availableAvcFiles, setAvailableAvcFiles] = useState<AvcFileInfo[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (open && window.electronAPI) {
      loadAvailableAvcFiles();
    }
  }, [open]);

  useEffect(() => {
    if (useProjectNameForAvc) {
      setNewCompositionName(projectName);
    }
  }, [projectName, useProjectNameForAvc]);

  const loadAvailableAvcFiles = async () => {
    if (window.electronAPI) {
      const files = await window.electronAPI.listAvcFiles();
      setAvailableAvcFiles(files);
    }
  };

  const handleBrowse = async () => {
    if (window.electronAPI) {
      const path = await window.electronAPI.browseAvcFile();
      if (path) {
        setSelectedAvcPath(path);
      }
    }
  };

  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a project name",
        variant: "destructive"
      });
      return;
    }

    let avcPath = selectedAvcPath;

    // If creating new composition
    if (!avcPath && newCompositionName.trim()) {
      if (window.electronAPI) {
        setIsCreating(true);
        const result = await window.electronAPI.createAvcFile(newCompositionName);
        setIsCreating(false);

        if (!result.success) {
          toast({
            title: "Error",
            description: result.error || "Failed to create Arena composition",
            variant: "destructive"
          });
          return;
        }

        avcPath = result.path!;
        toast({
          title: "Success",
          description: "Arena composition created successfully"
        });
      } else {
        toast({
          title: "Error",
          description: "Creating Arena compositions requires Electron environment",
          variant: "destructive"
        });
        return;
      }
    }

    if (!avcPath) {
      toast({
        title: "Error",
        description: "Please select or create an Arena composition",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsCreating(true);
      const project = await projectStorage.createProject(projectName.trim(), avcPath);
      
      toast({
        title: "Success",
        description: `Project "${projectName}" created successfully`
      });

      onOpenChange(false);
      navigate(`/workspace?project=${project.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Set up a new Resolume Companion project with Arena integration
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              id="projectName"
              placeholder="My Show 2024"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>

          <Tabs defaultValue="existing" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="existing">Link Existing</TabsTrigger>
              <TabsTrigger value="new">Create New</TabsTrigger>
            </TabsList>

            <TabsContent value="existing" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Select Arena Composition</Label>
                <div className="flex gap-2">
                  <Input
                    value={selectedAvcPath}
                    placeholder="No file selected"
                    readOnly
                    className="flex-1"
                  />
                  <Button onClick={handleBrowse} variant="outline">
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Browse
                  </Button>
                </div>
              </div>

              {availableAvcFiles.length > 0 && (
                <div className="space-y-2">
                  <Label>Or select from available compositions:</Label>
                  <div className="grid gap-2 max-h-48 overflow-y-auto">
                    {availableAvcFiles.map((file) => (
                      <Card
                        key={file.path}
                        className={`p-3 cursor-pointer hover:bg-accent transition-colors ${
                          selectedAvcPath === file.path ? 'border-primary bg-accent' : ''
                        }`}
                        onClick={() => setSelectedAvcPath(file.path)}
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{file.name}</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="new" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="compositionName">Composition Name</Label>
                <Input
                  id="compositionName"
                  placeholder="My Composition"
                  value={useProjectNameForAvc ? projectName : newCompositionName}
                  onChange={(e) => {
                    setUseProjectNameForAvc(false);
                    setNewCompositionName(e.target.value);
                  }}
                />
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="useProjectName"
                    checked={useProjectNameForAvc}
                    onChange={(e) => setUseProjectNameForAvc(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="useProjectName" className="cursor-pointer font-normal">
                    Use project name
                  </Label>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <Plus className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">New Composition</p>
                    <p>A minimal Arena composition will be created in your Resolume Compositions folder with 3 empty layers.</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isCreating}>
            Cancel
          </Button>
          <Button onClick={handleCreateProject} disabled={isCreating}>
            {isCreating ? "Creating..." : "Create Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
