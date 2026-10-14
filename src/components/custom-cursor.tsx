'use client';

import React, { useEffect, useState } from 'react';

export function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailingPosition, setTrailingPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Only enable on devices that have a fine pointer (mouse/trackpad), not touchscreens
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasFinePointer) return;

    setIsSupported(true);

    let animationFrameId: number;
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setPosition({ x: targetX, y: targetY });
      if (!isVisible) setIsVisible(true);
    };

    // Smooth physics loop for the trailing outer ring
    const followCursor = () => {
      // Ease factor (0.18 gives a snappy, luxurious trailing feel)
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      setTrailingPosition({ x: currentX, y: currentY });
      animationFrameId = requestAnimationFrame(followCursor);
    };

    animationFrameId = requestAnimationFrame(followCursor);

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Dynamic hover detection for buttons, links, inputs, and interactive targets
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'button, a, input, textarea, select, [role="button"], .cursor-pointer, .interactive-hover'
      );
      setIsHovered(!!interactive);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  if (!isSupported || !isVisible) return null;

  return (
    <>
      {/* Precision Core Dot */}
      <div
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[99999] transition-transform duration-75 ease-out"
        style={{
          transform: `translate3d(${position.x - 4}px, ${position.y - 4}px, 0) scale(${
            isClicking ? 0.7 : isHovered ? 1.4 : 1
          })`,
          backgroundColor: isHovered ? '#06B6D4' : '#1D4ED8',
        }}
      />

      {/* Trailing Ambient Ring */}
      <div
        className="fixed top-0 left-0 w-9 h-9 rounded-full pointer-events-none z-[99998] transition-all duration-200 ease-out"
        style={{
          transform: `translate3d(${trailingPosition.x - 18}px, ${trailingPosition.y - 18}px, 0) scale(${
            isClicking ? 0.8 : isHovered ? 1.7 : 1
          })`,
          borderWidth: isHovered ? '2px' : '1.5px',
          borderColor: isHovered ? 'rgba(6, 182, 212, 0.9)' : 'rgba(37, 99, 235, 0.45)',
          backgroundColor: isHovered ? 'rgba(6, 182, 212, 0.12)' : 'rgba(37, 99, 235, 0.04)',
          boxShadow: isHovered
            ? '0 0 20px rgba(6, 182, 212, 0.4), inset 0 0 10px rgba(6, 182, 212, 0.2)'
            : '0 0 10px rgba(37, 99, 235, 0.15)',
          backdropFilter: isHovered ? 'blur(1.5px)' : 'none',
        }}
      />
    </>
  );
}
