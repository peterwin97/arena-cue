export const formatTime = (seconds?: number): string => {
  if (seconds === undefined || seconds === null) return "00:00.00";
  
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  
  return `${mins.toString().padStart(2, '0')}:${secs.toFixed(2).padStart(5, '0')}`;
};

export const parseTime = (timeString: string): number => {
  const parts = timeString.split(':');
  if (parts.length !== 2) return 0;
  
  const mins = parseInt(parts[0], 10) || 0;
  const secs = parseFloat(parts[1]) || 0;
  
  return mins * 60 + secs;
};
