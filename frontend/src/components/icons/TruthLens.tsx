import React from "react";

interface TruthLensLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export const TruthLensLogo: React.FC<TruthLensLogoProps> = ({
  width = 400,
  height = 450,
  className = "",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 450"
      width={width}
      height={height}
      className={className}
    >
      <defs>
        <linearGradient id="tech-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1A237E" stopOpacity="1" />
          <stop offset="50%" stopColor="#00B0FF" stopOpacity="1" />
          <stop offset="100%" stopColor="#00E5FF" stopOpacity="1" />
        </linearGradient>

        <radialGradient
          id="center-glow"
          cx="50%"
          cy="50%"
          r="50%"
          fx="50%"
          fy="50%"
        >
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g transform="translate(100, 100)">
        <circle
          cx="100"
          cy="100"
          r="95"
          fill="none"
          stroke="url(#tech-gradient)"
          strokeWidth="8"
          opacity="0.8"
        />

        <g
          stroke="url(#tech-gradient)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="100" cy="30" r="5" fill="white" strokeWidth="2" />
          <circle cx="160.6" cy="65" r="5" fill="white" strokeWidth="2" />
          <circle cx="160.6" cy="135" r="5" fill="white" strokeWidth="2" />
          <circle cx="100" cy="170" r="5" fill="white" strokeWidth="2" />
          <circle cx="39.4" cy="135" r="5" fill="white" strokeWidth="2" />
          <circle cx="39.4" cy="65" r="5" fill="white" strokeWidth="2" />

          <circle cx="100" cy="60" r="4" fill="white" strokeWidth="2" />
          <circle cx="134.6" cy="80" r="4" fill="white" strokeWidth="2" />
          <circle cx="134.6" cy="120" r="4" fill="white" strokeWidth="2" />
          <circle cx="100" cy="140" r="4" fill="white" strokeWidth="2" />
          <circle cx="65.4" cy="120" r="4" fill="white" strokeWidth="2" />
          <circle cx="65.4" cy="80" r="4" fill="white" strokeWidth="2" />

          <path
            d="M100,30 L160.6,65 L160.6,135 L100,170 L39.4,135 L39.4,65 Z"
            opacity="0.6"
          />
          <path d="M100,30 L134.6,80" />
          <path d="M160.6,65 L134.6,120" />
          <path d="M160.6,135 L100,140" />
          <path d="M100,170 L65.4,120" />
          <path d="M39.4,135 L65.4,80" />
          <path d="M39.4,65 L100,60" />

          <path
            d="M100,60 L134.6,80 L134.6,120 L100,140 L65.4,120 L65.4,80 Z"
            strokeWidth="4"
          />
        </g>

        <circle cx="100" cy="100" r="18" fill="url(#tech-gradient)" />
        <circle cx="100" cy="100" r="10" fill="white" />
        <circle
          cx="100"
          cy="100"
          r="30"
          fill="url(#center-glow)"
          opacity="0.6"
        />
      </g>
    </svg>
  );
};
