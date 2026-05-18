import React, { useEffect, useRef } from 'react';

export default function MagicParticles() {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const COLORS = [
      'rgba(212, 175, 55,',
      'rgba(160, 100, 240,',
      'rgba(100, 180, 255,',
      'rgba(255, 200, 100,',
      'rgba(200, 150, 255,',
      'rgba(255, 255, 220,',
    ];

    function createOrb() {
      return {
        type: 'orb',
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 2,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: -(Math.random() * 0.45 + 0.08),
        opacity: Math.random() * 0.7 + 0.2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.04 + 0.01,
        drift: (Math.random() - 0.5) * 0.3,
      };
    }

    function createSpark() {
      return {
        type: 'spark',
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.8 + 0.5,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: -(Math.random() * 0.6 + 0.1),
        opacity: Math.random() * 0.8 + 0.2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.07 + 0.02,
        drift: (Math.random() - 0.5) * 0.4,
      };
    }

    function createDust() {
      return {
        type: 'dust',
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.2 + 0.3,
        speedX: (Math.random() - 0.5) * 0.15,
        speedY: -(Math.random() * 0.2 + 0.03),
        opacity: Math.random() * 0.4 + 0.05,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        drift: (Math.random() - 0.5) * 0.6,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.03 + 0.005,
      };
    }

    function createParticle() {
      const r = Math.random();
      if (r < 0.45) return createOrb();
      if (r < 0.7) return createSpark();
      return createDust();
    }

    const COUNT = 130;
    for (let i = 0; i < COUNT; i++) {
      const p = createParticle();
      p.y = Math.random() * canvas.height;
      particlesRef.current.push(p);
    }

    function drawBloomOrb(p, opacity) {
      const bloom1 = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 18);
      bloom1.addColorStop(0, `${p.color} ${opacity * 0.18})`);
      bloom1.addColorStop(1, `${p.color} 0)`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 18, 0, Math.PI * 2);
      ctx.fillStyle = bloom1;
      ctx.fill();

      const bloom2 = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 7);
      bloom2.addColorStop(0, `${p.color} ${opacity * 0.5})`);
      bloom2.addColorStop(1, `${p.color} 0)`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 7, 0, Math.PI * 2);
      ctx.fillStyle = bloom2;
      ctx.fill();

      const core = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 1.2);
      core.addColorStop(0, `${p.color} ${Math.min(1, opacity * 2.5)})`);
      core.addColorStop(0.5, `${p.color} ${Math.min(1, opacity * 1.5)})`);
      core.addColorStop(1, `${p.color} 0)`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = core;
      ctx.fill();
    }

    function drawSpark(p, opacity) {
      ctx.save();
      ctx.globalAlpha = opacity * 0.3;
      const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 8);
      grd.addColorStop(0, `${p.color} 1)`);
      grd.addColorStop(1, `${p.color} 0)`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 8, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.twinkle);
      ctx.fillStyle = `${p.color} 1)`;
      const s = p.size;
      ctx.beginPath();
      ctx.moveTo(0, -s * 4);
      ctx.lineTo(s * 0.35, -s * 0.35);
      ctx.lineTo(s * 4, 0);
      ctx.lineTo(s * 0.35, s * 0.35);
      ctx.lineTo(0, s * 4);
      ctx.lineTo(-s * 0.35, s * 0.35);
      ctx.lineTo(-s * 4, 0);
      ctx.lineTo(-s * 0.35, -s * 0.35);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function drawDust(p, opacity) {
      const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5);
      grd.addColorStop(0, `${p.color} ${opacity * 0.9})`);
      grd.addColorStop(0.4, `${p.color} ${opacity * 0.3})`);
      grd.addColorStop(1, `${p.color} 0)`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p, i) => {
        p.twinkle += p.twinkleSpeed;
        if (p.wobble !== undefined) p.wobble += p.wobbleSpeed;
        const twinkleFactor = (Math.sin(p.twinkle) + 1) / 2;
        const opacity = p.opacity * (0.3 + twinkleFactor * 0.7);

        if (p.type === 'orb') {
          drawBloomOrb(p, opacity);
          p.x += p.speedX + Math.sin(p.twinkle * 0.3) * p.drift;
          p.y += p.speedY;
        } else if (p.type === 'spark') {
          drawSpark(p, opacity);
          p.x += p.speedX + Math.sin(p.twinkle * 0.3) * p.drift;
          p.y += p.speedY;
        } else {
          drawDust(p, opacity);
          p.x += p.speedX + Math.sin(p.wobble) * p.drift;
          p.y += p.speedY;
        }

        if (p.y < -30 || p.x < -30 || p.x > canvas.width + 30) {
          const newP = createParticle();
          newP.y = canvas.height + 15;
          particlesRef.current[i] = newP;
        }
      });

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.65 }}
    />
  );
}
