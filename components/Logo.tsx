import React from 'react';

interface LogoProps {
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
    return (
        <div className={`text-center ${className}`} role="banner" aria-label="Fuerza Activa 50+ por Ana Herrero">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter leading-tight">
                Fuerza Activa <span className="text-indigo-400">50+</span>
            </h1>
            <p className="text-sm md:text-base opacity-80">
                por Ana Herrero
            </p>
        </div>
    );
};

export default Logo;
