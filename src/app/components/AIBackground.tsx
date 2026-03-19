import { useEffect, useRef } from 'react';

export function AIBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Binary particles
    const binaryChars = ['0', '1'];
    const particles: Array<{
      x: number;
      y: number;
      speed: number;
      char: string;
      opacity: number;
    }> = [];

    // Create binary particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 0.2 + Math.random() * 0.5,
        char: binaryChars[Math.floor(Math.random() * binaryChars.length)],
        opacity: 0.1 + Math.random() * 0.3,
      });
    }

    // Hexagon grid
    const hexagons: Array<{
      x: number;
      y: number;
      size: number;
      opacity: number;
    }> = [];

    const hexSize = 60;
    const rows = Math.ceil(canvas.height / (hexSize * 1.5)) + 2;
    const cols = Math.ceil(canvas.width / (hexSize * Math.sqrt(3))) + 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * hexSize * Math.sqrt(3) + (row % 2) * hexSize * Math.sqrt(3) / 2;
        const y = row * hexSize * 1.5;
        hexagons.push({
          x,
          y,
          size: hexSize,
          opacity: 0.03,
        });
      }
    }

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Draw hexagon
    const drawHexagon = (x: number, y: number, size: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const hx = x + size * Math.cos(angle);
        const hy = y + size * Math.sin(angle);
        if (i === 0) {
          ctx.moveTo(hx, hy);
        } else {
          ctx.lineTo(hx, hy);
        }
      }
      ctx.closePath();
    };

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw hexagons with mouse interaction
      hexagons.forEach((hex) => {
        const distance = Math.sqrt(
          Math.pow(hex.x - mouseRef.current.x, 2) + 
          Math.pow(hex.y - mouseRef.current.y, 2)
        );
        const maxDistance = 200;
        
        if (distance < maxDistance) {
          const intensity = 1 - distance / maxDistance;
          ctx.strokeStyle = `rgba(34, 197, 94, ${hex.opacity + intensity * 0.3})`;
        } else {
          ctx.strokeStyle = `rgba(255, 255, 255, ${hex.opacity})`;
        }
        
        ctx.lineWidth = 0.5;
        drawHexagon(hex.x, hex.y, hex.size);
        ctx.stroke();
      });

      // Draw and update binary particles
      particles.forEach((particle) => {
        // Draw particle
        const distance = Math.sqrt(
          Math.pow(particle.x - mouseRef.current.x, 2) + 
          Math.pow(particle.y - mouseRef.current.y, 2)
        );
        const maxDistance = 150;
        
        if (distance < maxDistance) {
          const intensity = 1 - distance / maxDistance;
          ctx.fillStyle = `rgba(34, 197, 94, ${particle.opacity + intensity * 0.5})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        }
        
        ctx.font = '14px monospace';
        ctx.fillText(particle.char, particle.x, particle.y);

        // Update position
        particle.y += particle.speed;
        if (particle.y > canvas.height) {
          particle.y = 0;
          particle.x = Math.random() * canvas.width;
        }

        // Randomly change character
        if (Math.random() < 0.01) {
          particle.char = binaryChars[Math.floor(Math.random() * binaryChars.length)];
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
