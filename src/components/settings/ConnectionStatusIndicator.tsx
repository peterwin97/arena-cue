import { CheckCircle2, XCircle, Loader2, AlertCircle } from "lucide-react";
import { ConnectionStatus } from "@/contexts/ResolumeContext";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ConnectionStatusIndicatorProps {
  status: ConnectionStatus;
  host: string;
  port: number;
  onClick?: () => void;
  className?: string;
  showLabel?: boolean;
}

export function ConnectionStatusIndicator({
  status,
  host,
  port,
  onClick,
  className,
  showLabel = true,
}: ConnectionStatusIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: CheckCircle2,
          color: 'text-green-500',
          label: 'Connected',
          bgColor: 'bg-green-500/10',
        };
      case 'connecting':
        return {
          icon: Loader2,
          color: 'text-yellow-500',
          label: 'Connecting...',
          bgColor: 'bg-yellow-500/10',
          animate: true,
        };
      case 'error':
        return {
          icon: AlertCircle,
          color: 'text-red-500',
          label: 'Error',
          bgColor: 'bg-red-500/10',
        };
      case 'disconnected':
      default:
        return {
          icon: XCircle,
          color: 'text-muted-foreground',
          label: 'Disconnected',
          bgColor: 'bg-muted',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const content = (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors",
        config.bgColor,
        onClick && "cursor-pointer hover:opacity-80",
        className
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4",
          config.color,
          config.animate && "animate-spin"
        )}
      />
      {showLabel && (
        <span className="text-sm font-medium">{config.label}</span>
      )}
    </div>
  );

  if (onClick) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">{config.label}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {host}:{port}
          </p>
          <p className="text-xs text-muted-foreground">
            Click to configure
          </p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}
