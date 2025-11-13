import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, FolderOpen, Plus, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StartMenu = () => {
  const navigate = useNavigate();

  const recentProjects = [
    { name: "Summer Festival 2024", date: "2 hours ago", path: "/compositions/summer-festival.json" },
    { name: "Corporate Event", date: "Yesterday", path: "/compositions/corporate.json" },
    { name: "DJ Set - Club Night", date: "3 days ago", path: "/compositions/club-night.json" },
  ];

  const handleNewProject = () => {
    navigate("/workspace");
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
            onClick={handleNewProject}
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
          <Card className="bg-surface border-border divide-y divide-border">
            {recentProjects.map((project, index) => (
              <div
                key={index}
                className="p-4 hover:bg-surface-elevated transition-colors cursor-pointer flex items-center justify-between group"
                onClick={handleNewProject}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-foreground font-medium group-hover:text-primary transition-colors">
                      {project.name}
                    </p>
                    <p className="text-sm text-muted-foreground">{project.date}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground font-mono">{project.path}</p>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StartMenu;
