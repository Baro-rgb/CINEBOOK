import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Loading = () => {
  const { nextUrl } = useParams();
  const navigate = useNavigate();
  const [dots, setDots] = useState(".");

  useEffect(() => {
    if (nextUrl) {
      setTimeout(() => {
        navigate("/" + nextUrl);
      }, 8000);
    }

    // Animated dots
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "." : prev + ".");
    }, 500);

    return () => clearInterval(interval);
  }, [nextUrl, navigate]);

  return (
    <div className="flex flex-col justify-center items-center min-h-[80vh] gap-6">
      
      {/* Spinner with glow effect */}
      <div className="relative">
        <div className="absolute inset-0 animate-ping opacity-20">
          <div className="h-16 w-16 rounded-full bg-primary"></div>
        </div>
        <div className="relative animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-primary border-r-primary shadow-lg shadow-primary/30"></div>
      </div>

      {/* Loading text */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white mb-2">
          Đang tải{dots}
        </h2>
        <p className="text-sm text-zinc-400">
          Vui lòng đợi một lát
        </p>
      </div>

      {/* Progress indicator */}
      {nextUrl && (
        <div className="flex gap-2 mt-4">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary/30 animate-pulse"
              style={{ 
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1.5s' 
              }}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Loading;