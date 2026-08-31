import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

// Safely guarantee plugin availability within this context
gsap.registerPlugin(MotionPathPlugin);

// ------------------------------------------------------------------------
// Safe GSAP helpers
// These exist purely to protect the timeline from missing/late/null
// forwarded refs. They do NOT alter timing, easing, labels, or order —
// they simply refuse to hand GSAP a null/undefined/empty target, which
// is what produces "GSAP target null not found" console warnings and
// can silently break a chained timeline.
// ------------------------------------------------------------------------
function resolveTargets(target) {
  if (Array.isArray(target)) {
    const filtered = target.filter(Boolean);
    return filtered.length > 0 ? filtered : null;
  }
  return target ? target : null;
}

// For calls made directly on a timeline instance (tl.to / tl.from / tl.set)
// Returns the SAME timeline instance whether or not the tween was applied,
// so chaining / sequencing on the master timeline is never broken.
function safeTo(tl, target, vars, position) {
  const resolved = resolveTargets(target);
  if (!resolved) return tl;
  return position !== undefined ? tl.to(resolved, vars, position) : tl.to(resolved, vars);
}

function safeFrom(tl, target, vars, position) {
  const resolved = resolveTargets(target);
  if (!resolved) return tl;
  return position !== undefined ? tl.from(resolved, vars, position) : tl.from(resolved, vars);
}

// For direct (non-timeline) gsap.set calls used to establish initial states.
// Pass a timeline as the optional 4th arg to run it as tl.set instead.
function safeSet(target, vars, tl) {
  const resolved = resolveTargets(target);
  if (!resolved) return null;
  const engine = tl || gsap;
  return engine.set(resolved, vars);
}

function IntroAnimation({
  onComplete,
  onStarAttached,
  onWheelWake,
  loginFormRef,
  wheelRef,
  logoRef,
  heroRef,
  navBarRef,
  footerRef
}) {
  const introRootRef = useRef(null);
  const backdropRef = useRef(null);
  const canvasRef = useRef(null);

  // Physical Singular Energy Node Elements
  const titleStarRef = useRef(null);
  const flareVRef = useRef(null);
  const beamRef = useRef(null);
  const titleTextRef = useRef(null);

  useEffect(() => {
    console.log("STEP 1: IntroAnimation useEffect started");
    const ctx = gsap.context(() => {
      // ------------------------------------------------------------------------
      // 1. Resolve Component Refs & Establish Initial States
      // ------------------------------------------------------------------------
      const form = loginFormRef?.current || {};
      const wheel = wheelRef?.current || {};
      const hero = heroRef?.current || {};

      const logoEl = logoRef?.current;
      const navBarEl = navBarRef?.current;
      const footerEl = footerRef?.current;

      // Advanced Canvas Setup for High-Fidelity Platinum Trails & Sparks
      const canvas = canvasRef.current;
      const renderCtx = canvas ? canvas.getContext("2d") : null;
      let animationFrameId;
      let sparks = [];
      let trails = [];
      let isTrackingComet = false;

      const resizeCanvas = () => {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      // Enforce pristine starting states across all target selectors
      // (already safe — filter(Boolean) strips any unresolved refs before
      // GSAP ever sees them)
      gsap.set(
        [
          titleStarRef.current, flareVRef.current,
          beamRef.current, titleTextRef.current, logoEl, navBarEl, footerEl,
          form.card, form.inputs, form.button,
          wheel.wheel, wheel.highlight, wheel.innovation
        ].filter(Boolean),
        { opacity: 0 }
      );

      // Pre-position layouts for physical momentum reveals
      safeSet(beamRef.current, { scaleY: 0, transformOrigin: "center top" });
      safeSet(hero.heading, { opacity: 0, y: 35, filter: "blur(12px)" });
      safeSet(hero.tagline, { opacity: 0, y: 20, filter: "blur(6px)" });
      safeSet(form.card, { y: 60, scale: 0.94, filter: "blur(12px)", transformOrigin: "center top" });
      safeSet(form.inputs, { opacity: 0, x: -25 });
      safeSet(form.button, { opacity: 0, y: 15 });
      safeSet(navBarEl, { y: -35, opacity: 0 });
      safeSet(footerEl, { y: 20, opacity: 0 });

      // Industrial Wheel state setup (Hidden, rotated back, dark metallic profile)
      safeSet(wheel.wheel, { scale: 0.65, rotation: -60, filter: "brightness(0.1) blur(15px)" });
      safeSet(wheel.highlight, { opacity: 0, scale: 0.85 });

      // ------------------------------------------------------------------------
      // 2. High-Fidelity Monochrome Particle Engine
      // ------------------------------------------------------------------------
      class PremiumSpark {
        constructor(x, y, angle, speed) {
          this.x = x;
          this.y = y;
          this.vx = Math.cos(angle) * speed;
          this.vy = Math.sin(angle) * speed;
          this.alpha = 1;
          this.decay = gsap.utils.random(0.012, 0.025);
          // Premium silver/monochrome profile (pure whites, metallic silvers)
          this.color = gsap.utils.random(0, 1) > 0.4 ? "#ffffff" : "#d9dade";
          this.size = gsap.utils.random(1.2, 3.2);
        }
        draw() {
          if (!renderCtx) return;
          renderCtx.save();
          renderCtx.globalAlpha = this.alpha;
          renderCtx.shadowBlur = 12;
          renderCtx.shadowColor = "#ffffff";
          renderCtx.fillStyle = this.color;
          renderCtx.beginPath();
          renderCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          renderCtx.fill();
          renderCtx.restore();
        }
        update() {
          this.x += this.vx;
          this.y += this.vy;
          this.vy += 0.04; // Gravity simulation
          this.alpha -= this.decay;
        }
      }

      const drawScene = () => {
        if (!renderCtx || !canvas) {
          animationFrameId = requestAnimationFrame(drawScene);
          return;
        }
        renderCtx.clearRect(0, 0, canvas.width, canvas.height);

        // Continuous high-speed comet trail capturing the star's dynamic coordinate positions
        if (isTrackingComet && titleStarRef.current) {
          const rect = titleStarRef.current.getBoundingClientRect();
          const starX = rect.left + rect.width / 2;
          const starY = rect.top + rect.height / 2;

          trails.push({ x: starX, y: starY });
          if (trails.length > 40) trails.shift();
        } else {
          if (trails.length > 0) trails.shift();
        }

        renderCtx.save();
        for (let i = 0; i < trails.length; i++) {
          const ratio = i / trails.length;
          renderCtx.globalAlpha = ratio * 0.35;
          renderCtx.shadowBlur = 20;
          renderCtx.shadowColor = "#ffffff";
          renderCtx.fillStyle = `rgba(245, 245, 247, ${ratio})`;
          renderCtx.beginPath();
          renderCtx.arc(trails[i].x, trails[i].y, 5 * ratio, 0, Math.PI * 2);
          renderCtx.fill();
        }
        renderCtx.restore();

        // Explosive monochrome impact sparks processing
        sparks = sparks.filter(s => s.alpha > 0);
        sparks.forEach(s => {
          s.update();
          s.draw();
        });

        animationFrameId = requestAnimationFrame(drawScene);
      };
      animationFrameId = requestAnimationFrame(drawScene);

      // ------------------------------------------------------------------------
      // 3. The 10/10 Master Cinematic Timeline Sequence
      // ------------------------------------------------------------------------
      const masterTl = gsap.timeline({
        onComplete: () => {
          console.log("✅ Timeline Completed");
          console.log("STEP 5: Timeline Completed");

          cancelAnimationFrame(animationFrameId);
          window.removeEventListener("resize", resizeCanvas);

          if (onComplete) onComplete();
        }
      });
      console.log("STEP 2: Timeline created");

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const rightColumnWidth = window.innerWidth * 0.6;
      const targetWheelX = window.innerWidth - (rightColumnWidth / 2);
      const targetWheelY = centerY - 85;

      // Camera Dynamics: Subtle ambient breathing zoom active immediately from start
      gsap.to(introRootRef.current, {
        scale: 1.02,
        duration: 4.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });

      masterTl.call(() => {
        console.log("STEP 3A: Entered Phase 1");
      });

      // --- PHASE 1: Singularity Ignition & High-Energy Beam ---
      masterTl
        .to(backdropRef.current, { opacity: 1, duration: 0.3 })
        .to(titleStarRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: "power2.out"
        })
        .to([flareVRef.current], {
          opacity: 1,
          scaleY: 1.6,
          duration: 0.4,
          ease: "expo.out"
        }, "-=0.2")
        .to(beamRef.current, {
          opacity: 1,
          scaleY: 1,
          duration: 0.7,
          ease: "expo.out"
        }, "-=0.3")
        .to(titleTextRef.current, {
          opacity: 1,
          letterSpacing: "0.42em",
          duration: 1.4,
          ease: "power4.out"
        }, "-=0.5");

      // --- PHASE 2: Beam Compression & Continuous Object Transformation ---
      masterTl
        .addLabel("collapse", "+=0.2")
        .to(beamRef.current, {
          scaleY: 0,
          opacity: 0,
          duration: 0.45,
          ease: "power4.in"
        }, "collapse")
        .to(titleTextRef.current, {
          opacity: 0,
          scale: 0.92,
          filter: "blur(12px)",
          duration: 0.5,
          ease: "power3.in"
        }, "collapse")
        .to([flareVRef.current], {
          scaleY: 0.3,
          opacity: 0.5,
          duration: 0.45,
          ease: "power4.in"
        }, "collapse")

        // Transform: Physical node shrinks down, concentrates mass, prepares for acceleration
        .to(titleStarRef.current, {
          scale: 0.5,
          duration: 0.4,
          ease: "power3.inOut",
          onComplete: () => {
            isTrackingComet = true;
          }
        }, "collapse");

      masterTl.call(() => {
        console.log("STEP 3B: Entered Phase 2");
      }, null, "collapse");

      // --- PHASE 3: Cinematic Flight Path (Kinetic Acceleration) ---
      masterTl.call(() => {
        console.log("STEP 3C: Entered Phase 3");
      });
      masterTl
        .to(titleStarRef.current, {
          motionPath: {
            path: [
              { x: 0, y: 0 },
              { x: -window.innerWidth * 0.2, y: -window.innerHeight * 0.35 },
              { x: -window.innerWidth * 0.4, y: window.innerHeight * 0.1 },
              { x: -window.innerWidth * 0.05, y: window.innerHeight * 0.35 },
              { x: targetWheelX - centerX, y: targetWheelY - centerY }
            ],
            autoRotate: false
          },
          duration: 1.8,
          ease: "power2.inOut"
        });

      // --- PHASE 4: Impact, Camera Shockwave & Mechanical Conduction ---
      masterTl
        .addLabel("impact")
        .call(() => {
          isTrackingComet = false;
          // Deconstruct flares smoothly upon impact integration
          gsap.set([titleStarRef.current, flareVRef.current], { display: "none" });

          // Generate sharp monochrome cloud of high-velocity fragments
          for (let i = 0; i < 75; i++) {
            const angle = Math.PI * 2 * (i / 75) + gsap.utils.random(-0.15, 0.15);
            const speed = gsap.utils.random(5, 16);
            sparks.push(new PremiumSpark(targetWheelX, targetWheelY, angle, speed));
          }
          if (onWheelWake) onWheelWake("glow");
        })

        // Intense physical Camera Shaking impact layer overlaid onto base breathing scale
        .to(introRootRef.current, {
          x: () => gsap.utils.random(-20, 20),
          y: () => gsap.utils.random(-20, 20),
          duration: 0.04,
          repeat: 4,
          yoyo: true,
          ease: "none"
        }, "impact")
        .to(introRootRef.current, { x: 0, y: 0, duration: 0.15, ease: "power2.out" });

      masterTl.call(() => {
        console.log("STEP 3D: Entered Phase 4");
      }, null, "impact");

      // Mechanical Shock & Specular Reflection Conduction
      // (wheel.* comes from a forwarded ref object — guard against it
      // being unresolved/partial so GSAP never receives a null target)
      safeTo(masterTl, wheel.wheel, {
        opacity: 1,
        scale: 1.06,
        rotation: 0,
        filter: "brightness(1.5) blur(0px)",
        duration: 0.7,
        ease: "power4.out"
      }, "impact");

      masterTl.call(() => {
        console.log("Wheel element:", wheel.wheel);
        console.log("Computed opacity:", getComputedStyle(wheel.wheel).opacity);
      });

      masterTl.call(() => {
        if (onWheelWake) onWheelWake("waking"); // Triggers internal CSS specular sheen sweep
      }, null, "-=0.35");

      // Damped mechanical stabilization
      safeTo(masterTl, wheel.wheel, {
        scale: 1,
        filter: "brightness(1) contrast(1.05)",
        duration: 1.4,
        ease: "elastic.out(1, 0.55)"
      });
      safeTo(masterTl, wheel.highlight, {
        opacity: 1,
        scale: 1,
        duration: 1.1,
        ease: "power2.out"
      }, "impact+=0.35");

      // --- PHASE 5: UI Layer Composition & Ambient Fade Out ---
      masterTl.addLabel("uiReveal", "-=0.75");

      masterTl.call(() => {
        console.log("✅ Reached uiReveal");
      }, null, "uiReveal");

      masterTl.call(() => {
        console.log("STEP 3E: Entered Phase 5");
      }, null, "uiReveal");

      safeTo(masterTl, backdropRef.current, {
        opacity: 0,
        duration: 1.3,
        ease: "power2.inOut"
      }, "uiReveal");

      // Structural Form and Typography Rise Sequences
      // (logoEl / hero.* / form.* / footerEl are all forwarded refs)
      masterTl.call(() => {
        console.log("✅ Logo animation started");
        console.log("Logo ref:", logoEl);
      }, null, "uiReveal");

      masterTl.call(() => {
        console.log("STEP 4: Logo animation");
        console.log("logoRef =", logoEl);
      });
      safeTo(masterTl, logoEl, { opacity: 1, duration: 0.65, ease: "power2.out" }, "uiReveal");
      safeTo(masterTl, hero.heading, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.85, ease: "power4.out" }, "uiReveal+=0.1");
      safeTo(masterTl, hero.tagline, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.65, ease: "power2.out" }, "uiReveal+=0.2");

      // Glassmorphism login card pop-in orchestration
      safeTo(masterTl, form.card, { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.95, ease: "back.out(1.15)" }, "uiReveal+=0.25");
      safeTo(masterTl, form.inputs, { opacity: 1, x: 0, duration: 0.55, stagger: 0.07, ease: "power3.out" }, "uiReveal+=0.45");
      safeTo(masterTl, form.button, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" }, "uiReveal+=0.65");
      safeTo(masterTl, footerEl, { opacity: 1, y: 0, duration: 0.55 }, "uiReveal+=0.75");

      // Right side semantic layer arrivals
      safeTo(masterTl, navBarEl, { opacity: 1, y: 0, duration: 0.75, ease: "power3.out" }, "uiReveal+=0.15");
      safeTo(masterTl, wheel.innovation, { opacity: 1, duration: 0.85 }, "uiReveal+=0.35");

      // Anchor attachment confirmations
      masterTl.call(() => {
        if (onStarAttached) {
          onStarAttached(0);
          onStarAttached(1);
          onStarAttached(2);
        }
      });

    });

    return () => ctx.kill();
  }, [loginFormRef, wheelRef, logoRef, heroRef, navBarRef, footerRef, onComplete, onStarAttached, onWheelWake]);

  return (
    <div ref={introRootRef} className="intro-root">
      <div ref={backdropRef} className="intro-backdrop" />

      <div className="intro-center-group">
        <div ref={titleStarRef} className="intro-title-star">
          <div ref={flareVRef} className="intro-star-flare intro-star-flare-v" />
        </div>
        <div ref={beamRef} className="intro-beam" />
        <h1 ref={titleTextRef} className="intro-title-text">
          WHEELS INDIA LIMITED 
        </h1>
      </div>

      <canvas ref={canvasRef} className="comet-particle-canvas" />
    </div>
  );
}

export default IntroAnimation;
