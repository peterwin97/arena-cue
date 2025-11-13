import { Button } from "@/components/ui/button";
import { Maximize2, Mic, Video, Type, Music, Clock, Lightbulb, Network } from "lucide-react";

export const Toolbar = () => {
  return (
    <div className="h-12 bg-surface border-b border-border flex items-center px-4 gap-1">
      <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-muted">
        <Video className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-muted">
        <Mic className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-muted">
        <Music className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-muted">
        <Type className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-muted">
        <Lightbulb className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-muted">
        <Network className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-muted">
        <Clock className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-muted">
        <Maximize2 className="w-4 h-4" />
      </Button>
    </div>
  );
};
