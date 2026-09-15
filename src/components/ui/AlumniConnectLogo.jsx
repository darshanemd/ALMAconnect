import React from 'react';

/**
 * AlumniConnect brand logo — 3D glossy interlocking network swooshes with graduation cap.
 * Supports rotating outer wings while keeping the central graduation cap 100% constant/upright.
 */
export default function AlumniConnectLogo({ 
  size = 40, 
  className = '', 
  wingRotation = 0, 
  spinWings = false 
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 800 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="AlumniConnect Logo"
      role="img"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    >
      <defs>
        {/* Rich gradients for the 3D glossy look */}
        <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#004cd0" />
          <stop offset="50%" stopColor="#0072ff" />
          <stop offset="100%" stopColor="#00c3ff" />
        </linearGradient>

        <linearGradient id="tealGrad" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00b5c4" />
          <stop offset="50%" stopColor="#009fae" />
          <stop offset="100%" stopColor="#007682" />
        </linearGradient>

        <linearGradient id="greenGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4fa900" />
          <stop offset="60%" stopColor="#7cd600" />
          <stop offset="100%" stopColor="#a3e200" />
        </linearGradient>

        <linearGradient id="capGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#06346c" />
          <stop offset="100%" stopColor="#001a37" />
        </linearGradient>

        {/* Drop shadow filter for clean interlocking depth separation */}
        <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="5" stdDeviation="6" floodColor="#000d1a" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* Main Unified Interlocking Group */}
      <g transform="translate(0, -10)">
        
        {/* ROTATING OUTER SWOOSHES GROUP (Rotates smoothly around 400,430 while central cap stays 100% constant) */}
        <g transform={`rotate(${wingRotation}, 400, 430)`}>
          {/* 1. TEAL / SKY BLUE SWOOSH (Rotated 240 Degrees around center point 400, 430) */}
          <g transform="rotate(240, 400, 430)">
            <path
              d="M 235,550 C 145,430 185,300 380,315 C 445,320 495,345 515,360 C 475,335 425,330 370,340 C 250,360 215,470 280,555 C 325,615 420,645 495,600 C 420,635 305,615 235,550 Z"
              fill="url(#tealGrad)"
            />
            <circle cx="218" cy="545" r="48" fill="#ffffff" />
            <circle cx="218" cy="545" r="31" fill="url(#tealGrad)" />
          </g>

          {/* 2. GREEN SWOOSH (Rotated 120 Degrees around center point 400, 430) */}
          <g transform="rotate(120, 400, 430)" filter="url(#dropShadow)">
            <path
              d="M 235,550 C 145,430 185,300 380,315 C 445,320 495,345 515,360 C 475,335 425,330 370,340 C 250,360 215,470 280,555 C 325,615 420,645 495,600 C 420,635 305,615 235,550 Z"
              fill="url(#greenGrad)"
            />
            <circle cx="218" cy="545" r="48" fill="#ffffff" />
            <circle cx="218" cy="545" r="31" fill="url(#greenGrad)" />
          </g>

          {/* 3. ROYAL BLUE SWOOSH (Base Position / 0 Degrees) */}
          <g transform="rotate(0, 400, 430)" filter="url(#dropShadow)">
            <path
              d="M 235,550 C 145,430 185,300 380,315 C 445,320 495,345 515,360 C 475,335 425,330 370,340 C 250,360 215,470 280,555 C 325,615 420,645 495,600 C 420,635 305,615 235,550 Z"
              fill="url(#blueGrad)"
            />
            <circle cx="218" cy="545" r="48" fill="#ffffff" />
            <circle cx="218" cy="545" r="31" fill="url(#blueGrad)" />
          </g>
        </g>

        {/* CENTRAL GRADUATION CAP — 100% CONSTANT, STATIONARY & UPRIGHT */}
        <g transform="translate(0, 25)">
          <polygon points="400,345 502,392 400,440 298,392" fill="url(#capGrad)" />
          <polygon points="400,345 502,392 400,399 298,392" fill="#ffffff" opacity="0.12" />
          <path
            d="M 344,420 L 344,452 C 344,482 456,482 456,452 L 456,420 L 400,446 Z"
            fill="url(#capGrad)"
            filter="url(#dropShadow)"
          />
          <ellipse cx="400" cy="392" rx="5" ry="3.5" fill="#001124" />
          <path
            d="M 402,393 C 435,402 476,430 478,475"
            stroke="#052c5c"
            strokeWidth="4.5"
            fill="none"
            strokeLinecap="round"
          />
          <polygon points="478,475 469,518 488,518" fill="url(#capGrad)" />
        </g>

      </g>
    </svg>
  );
}
