import React from 'react'
import { LogoProps } from '../types/Candidate'
export const Logo: React.FC<LogoProps> = ({ width = 300, height = 80, className = '' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 300 80"
      width={width}
      height={height}
      className={className}
    >
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#6D28D9', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#7C3AED', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path
        d="M40 20 L60 20 L60 40 L80 40 L80 60 L40 60 Z"
        fill="url(#gradient)"
        className="logo-symbol"
      />
      <text x="95" y="48" fontFamily="Arial" fontWeight="bold" fontSize="32" fill="#FFFFFF">
        Next
        <tspan fill="#7C3AED">Step</tspan>
      </text>
      <text x="95" y="65" fontFamily="Arial" fontSize="12" fill="#9CA3AF">
        Your Career Journey Starts Here
      </text>
    </svg>
  )
}