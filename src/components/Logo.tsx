import { useState } from "react";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

const Logo = ({ className = "", width = 48, height = 48 }: LogoProps) => {
  const [imageError, setImageError] = useState(false);
  
  // Try to load the logo image first, fallback to a placeholder if not available
  const imageUrl = "/logo.png";

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {!imageError ? (
        <img
          src={imageUrl}
          alt="Logo do Congresso"
          width={width}
          height={height}
          className="rounded-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        // Fallback to a simple logo using the Music icon
        <div 
          className="bg-primary rounded-full flex items-center justify-center text-primary-foreground"
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          <span className="text-xl">🎵</span>
        </div>
      )}
    </div>
  );
};

export default Logo;