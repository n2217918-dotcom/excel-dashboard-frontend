import React, { useMemo } from "react";
import { motion } from "framer-motion";

function generateParticles(count) {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: Math.random() * 1.6 + 0.6,
    duration: Math.random() * 18 + 22,
    delay: Math.random() * 8,
    baseOpacity: Math.random() * 0.3 + 0.12,
  }));
}

function ParticlesBackground({ count = 34 }) {
  const particles = useMemo(() => generateParticles(count), [count]);

  return (
    <div className="particles-field" aria-hidden="true">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="particle-star"
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
          initial={{ opacity: p.baseOpacity }}
          animate={{
            y: [0, -12, 0],
            opacity: [p.baseOpacity, p.baseOpacity * 1.7, p.baseOpacity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default ParticlesBackground;