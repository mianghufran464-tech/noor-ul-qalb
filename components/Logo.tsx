
import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    viewBox="0 0 512 512" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
  >
    {/* Quran Stand (Rehal) */}
    <path d="M150 420C180 420 220 400 256 380C292 400 332 420 362 420" stroke="#065f46" strokeWidth="20" strokeLinecap="round"/>
    <path d="M180 450L240 380M332 450L272 380" stroke="#065f46" strokeWidth="20" strokeLinecap="round"/>
    
    {/* Open Quran Pages */}
    <path d="M256 360C200 360 130 330 130 280L256 310L382 280C382 330 312 360 256 360Z" fill="#d4af37"/>
    <path d="M256 310V360" stroke="#b8860b" strokeWidth="2"/>
    
    {/* Mosque Dome */}
    <path d="M180 250C180 180 210 130 256 130C302 130 332 180 332 250H180Z" fill="#065f46"/>
    <path d="M200 250C200 210 220 180 256 180C292 180 312 210 312 250H200Z" fill="white" fillOpacity="0.2"/>
    
    {/* Crescent and Star on Top */}
    <path d="M256 70V130" stroke="#065f46" strokeWidth="8" strokeLinecap="round"/>
    <circle cx="256" cy="60" r="10" fill="#d4af37" />
  </svg>
);
