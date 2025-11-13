import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WorkspaceHeaderProps {
  projectName: string;
}

export const WorkspaceHeader = ({ projectName }: WorkspaceHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="h-14 bg-surface border-b border-border flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="hover:bg-muted"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold text-foreground">{projectName}</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="hover:bg-muted">
          <Save className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="hover:bg-muted">
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
};
