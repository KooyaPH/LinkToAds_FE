interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  variant?: "default" | "white";
}

export default function LoadingSpinner({ 
  size = "md", 
  className = "",
  variant = "default"
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-12 w-12",
    lg: "h-20 w-20",
  };

  const strokeWidths = {
    sm: 3,
    md: 4,
    lg: 5,
  };

  const radius = {
    sm: 10,
    md: 16,
    lg: 22,
  };

  const center = {
    sm: 12,
    md: 20,
    lg: 28,
  };

  const viewBox = {
    sm: "0 0 24 24",
    md: "0 0 40 40",
    lg: "0 0 56 56",
  };

  const r = radius[size];
  const cx = center[size];
  const cy = center[size];
  const circumference = 2 * Math.PI * r;
  
  // Purple segment is approximately 25-30% of the circle
  // Starting at 3 o'clock (0 degrees), extending counter-clockwise
  // Since SVG circles start at 3 o'clock, we position the purple segment first
  const purpleLength = circumference * 0.28; // ~28% for a quarter to one-third
  const greyLength = circumference - purpleLength; // Remaining grey portion

  // Color variants
  const activeColor = variant === "white" ? "#ffffff" : "#684bf9"; // vibrant purple or white
  const bgColor = variant === "white" ? "rgba(255, 255, 255, 0.3)" : "#52525b"; // semi-transparent white or grey

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <svg
        className={`${sizeClasses[size]} animate-spin`}
        viewBox={viewBox[size]}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Full grey/white circle background */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidths[size]}
          strokeDasharray={`${greyLength} ${circumference}`}
          strokeDashoffset={purpleLength}
          strokeLinecap="round"
        />
        {/* Purple/white segment - starting at 3 o'clock, extending counter-clockwise */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={activeColor}
          strokeWidth={strokeWidths[size]}
          strokeDasharray={`${purpleLength} ${circumference}`}
          strokeDashoffset={0}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
