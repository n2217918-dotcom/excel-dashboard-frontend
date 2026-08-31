import React, { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Canvas-based particle trail. No React state per particle — particles
 * live in a plain mutable array and are drawn/updated on gsap's own
 * ticker, so spawning dozens of them per second never triggers a
 * React re-render.
 *
 * `positionRef` is a mutable ref of shape { x, y, active } that the
 * intro timeline updates every frame during the comet's travel. This
 * component just reads it.
 */
function CometParticles({ positionRef }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const lastPosRef = useRef({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const spawnAt = (x, y, velocity) => {
      const count = velocity > 22 ? 3 : velocity > 8 ? 2 : 1;
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          size: Math.min(4.5, 1.5 + velocity * 0.05),
          life: 0,
          maxLife: 500 + Math.random() * 300,
          // Same white/green energy family as the comet itself — no
          // separate color identity, so the trail always reads as the
          // same object's energy, never a second thing.
          hue: Math.random() > 0.5 ? "140,171,88" : "255,255,255",
        });
      }
    };

    const tick = (time, deltaMs) => {
      const pos = positionRef.current;

      if (pos && pos.active && pos.x != null) {
        const last = lastPosRef.current;
        let velocity = 0;
        if (last.x != null) {
          velocity = Math.hypot(pos.x - last.x, pos.y - last.y);
        }
        lastPosRef.current = { x: pos.x, y: pos.y };
        spawnAt(pos.x, pos.y, velocity);
      } else {
        lastPosRef.current = { x: null, y: null };
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter((p) => {
        p.life += deltaMs;
        const t = p.life / p.maxLife;
        if (t >= 1) return false;

        const opacity = 1 - t;
        const size = p.size * (1 - t * 0.7);

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(size, 0.1), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.hue}, ${opacity * 0.8})`;
        ctx.fill();
        return true;
      });
    };

    const onTick = () => {
      const deltaMs = gsap.ticker.deltaRatio(60) * (1000 / 60);
      tick(gsap.ticker.time, deltaMs);
    };

    gsap.ticker.add(onTick);

    return () => {
      gsap.ticker.remove(onTick);
      window.removeEventListener("resize", resize);
    };
  }, [positionRef]);

  return <canvas ref={canvasRef} className="comet-particle-canvas" aria-hidden="true" />;
}

export default CometParticles;