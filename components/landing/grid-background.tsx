"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface GridBackgroundProps {
  className?: string;
}

const GridBackground = ({ className }: GridBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      
      // Set canvas dimensions with device pixel ratio for sharp lines
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      
      // Scale context according to device pixel ratio
      ctx.scale(dpr, dpr);
      
      // Set canvas CSS dimensions
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      drawGrid(width, height);
    };

    const drawGrid = (width: number, height: number) => {
      ctx.clearRect(0, 0, width, height);
      
      // Very light purple color for grid lines
      ctx.strokeStyle = "rgba(249,247,247,255)";
      ctx.lineWidth = 2;
      
      const gridSize = 120; // Size of grid cells
      
      // Draw vertical lines
      for (let x = -20; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      
      // Draw horizontal lines
      for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    };

    // Initial setup
    resizeCanvas();
    
    // Handle window resize
    window.addEventListener("resize", resizeCanvas);
    
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "fixed inset-0 -z-10 w-full h-full bg-white/95",
        className
      )}
    />
  );
};

export default GridBackground;
