import React from "react";

interface FacebookIconProps {
  width?: number;
  height?: number;
  className?: string;
}

export const FacebookIcon: React.FC<FacebookIconProps> = ({
  width = 24,
  height = 24,
  className = "",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={width}
      height={height}
      className={className}
    >
      <g fill="none" fillRule="evenodd">
        <path
          d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
          fill="#1877F2"
        />
        <path
          d="M16.671 15.469L17.203 12h-3.328V9.749c0-.949.465-1.873 1.956-1.873h1.513V4.924s-1.374-.234-2.686-.234c-2.741 0-4.533 1.66-4.533 4.668v2.642H7.078v3.469h3.047v8.385a12.09 12.09 0 003.75 0v-8.385h2.796z"
          fill="#ffffff"
        />
      </g>
    </svg>
  );
};
