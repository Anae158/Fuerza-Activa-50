import React from 'react';
import { DumbbellIcon } from './icons';

interface LogoProps {
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
    return (
        <div className={`flex items-center justify-center ${className}`} role="banner" aria-label="Fuerza Activa 50+ por Ana Herrero">
            <DumbbellIcon className="h-12 w-12 text-indigo-500 mr-4" />
            <div className="text-left">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter leading-tight">
                    Fuerza Activa <span className="text-indigo-400">50+</span>
                </h1>
                <p className="text-sm md:text-base opacity-80">
                    por Ana Herrero
                </p>
            </div>
        </div>
    );
};

export default Logo;