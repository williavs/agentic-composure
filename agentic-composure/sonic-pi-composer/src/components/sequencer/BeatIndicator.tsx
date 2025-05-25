interface BeatIndicatorProps {
  isActive: boolean;
  label: string;
}

export function BeatIndicator({ isActive, label }: BeatIndicatorProps) {
  return (
    <div className={`
      w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-100
      ${isActive 
        ? 'bg-primary text-primary-foreground scale-110 shadow-lg' 
        : 'bg-muted text-muted-foreground'
      }
    `}>
      {label}
    </div>
  );
} 