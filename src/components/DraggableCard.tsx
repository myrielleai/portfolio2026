// src/components/DraggableCard.tsx
import React, { useState, useRef, useEffect } from "react";
import { playClickSound } from "../utils/audio";

interface DraggableCardProps {
  initialLeft: number; // percentage (0-100)
  initialTop: number; // percentage (0-100)
  initialRotation?: number; // degrees
  children: React.ReactNode;
  className?: string;
}

export default function DraggableCard({
  initialLeft,
  initialTop,
  initialRotation = 0,
  children,
  className = "",
}: DraggableCardProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const cardStart = useRef({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // Initialize position in pixels based on percentage
  useEffect(() => {
    if (cardRef.current && cardRef.current.parentElement) {
      const parent = cardRef.current.parentElement;
      const parentRect = parent.getBoundingClientRect();
      setPosition({
        x: (initialLeft / 100) * parentRect.width,
        y: (initialTop / 100) * parentRect.height,
      });
    }
  }, [initialLeft, initialTop]);

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStart.current = { x: clientX, y: clientY };
    cardStart.current = { x: position.x, y: position.y };
    playClickSound(0.08);
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const deltaX = clientX - dragStart.current.x;
    const deltaY = clientY - dragStart.current.y;
    
    // Bounds check to keep card on the board
    if (cardRef.current && cardRef.current.parentElement) {
      const parent = cardRef.current.parentElement;
      const parentRect = parent.getBoundingClientRect();
      const cardRect = cardRef.current.getBoundingClientRect();
      
      const newX = Math.max(0, Math.min(cardStart.current.x + deltaX, parentRect.width - cardRect.width / 2));
      const newY = Math.max(0, Math.min(cardStart.current.y + deltaY, parentRect.height - cardRect.height / 2));
      setPosition({ x: newX, y: newY });
    }
  };

  const handleEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      playClickSound(0.04);
    }
  };

  // Mouse handlers
  const onMouseDown = (e: React.MouseEvent) => {
    // Only drag with left click and avoid dragging from links/buttons
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest("a") || target.closest("button") || target.closest("input")) return;
    
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("a") || target.closest("button") || target.closest("input")) return;
    
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onMouseUp = () => {
      handleEnd();
    };

    const onTouchEnd = () => {
      handleEnd();
    };

    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      window.addEventListener("touchmove", onTouchMove, { passive: false });
      window.addEventListener("touchend", onTouchEnd);
    }

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [isDragging, position]);

  return (
    <div
      ref={cardRef}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      className={`absolute select-none transition-shadow duration-200 z-20 ${className}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `rotate(${initialRotation + (isDragging ? (initialRotation > 0 ? 1 : -1) : 0)}deg) scale(${isDragging ? 1.02 : 1})`,
        boxShadow: isDragging 
          ? "0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.08)"
          : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        cursor: isDragging ? "grabbing" : "grab",
      }}
    >
      {children}
    </div>
  );
}
