import React from 'react';

export const ChefHatIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className}
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <path d="M8 19v-5m8 5v-5m-8-8c-1.78 0-3.46.7-4.65 1.85A6.36 6.36 0 0 0 2 12h20a6.36 6.36 0 0 0-1.35-4.15A6.41 6.41 0 0 0 16 6c-1.78 0-3.46.7-4.65 1.85A6.36 6.36 0 0 0 8 6Z" />
        <path d="M12 6c-1.78 0-3.46.7-4.65 1.85A6.36 6.36 0 0 0 2 12h20a6.36 6.36 0 0 0-1.35-4.15A6.41 6.41 0 0 0 12 6Z" />
    </svg>
);
