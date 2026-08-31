import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { motion } from "framer-motion";
import wheelImg from "../assets/images/wheel1.png";
import rftMachineImg from "../assets/images/rft-machine.png";
import cftMachineImg from "../assets/images/cft-machine.png";
import cvBiaxialMachineImg from "../assets/images/cv-biaxial-machine.png";
import lpBiaxialMachineImg from "../assets/images/lp-biaxial-machine.png";
import ParticlesBackground from "./ParticlesBackground.jsx";
import InnovationHighlight from "./InnovationHighlight.jsx";

export const LOAD_POINTS = [
  { key: "cft", top: "20%", left: "36%" },
  { key: "hub", top: "48%", left: "52%" },
  { key: "rft", top: "68%", left: "64%" },
];

const PRODUCT_TESTING_TEXT = "P R O D U C T\u00A0\u00A0\u00A0T E S T I N G";
const PRODUCT_TESTING_CHARS = PRODUCT_TESTING_TEXT.split("");

const labelContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const labelCharVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.1 } },
};

// Sequential machine reveal: RFT at +0.15s, CFT at +0.35s, CV at
// +0.55s, LP at +0.75s — an even 0.2s stagger with a 0.15s initial
// delay, all driven by the same `rotating` boolean the wheel spin and
// the PRODUCT TESTING label already use. Total sequence finishes
// around 1s after rotation begins.
const collageContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.15,
      staggerChildren: 0.2,
    },
  },
};

const collageImageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: "easeInOut" } },
};

const Wheel = forwardRef(function Wheel({ wakeStage, rotating, attachedPoints }, ref) {
  const wheelImgRef = useRef(null);
  const highlightRef = useRef(null);
  const innovationRef = useRef(null);

  useImperativeHandle(ref, () => ({
    wheel: wheelImgRef.current,
    highlight: highlightRef.current,
    innovation: innovationRef.current,
  }));

  const decorativeVisible = wakeStage === "glow" || wakeStage === "waking" || rotating;
  const sweeping = wakeStage === "waking";

  return (
    <div className="wheel-stage">
      {/* Industrial machine collage — sits behind everything else in
          this panel. The four images fade in one at a time, staggered,
          starting once `rotating` becomes true (i.e. once the intro's
          GSAP timeline has finished and continuous rotation begins).
          Driven entirely by Framer Motion variants — no second GSAP
          timeline, no change to IntroAnimation.jsx. */}
      <div className="machine-collage" aria-hidden="true">
        <motion.div
          className="machine-collage-inner"
          variants={collageContainerVariants}
          initial="hidden"
          animate={rotating ? "visible" : "hidden"}
        >
          <motion.img
            src={rftMachineImg}
            alt=""
            className="machine-image machine-image-rft"
            variants={collageImageVariants}
          />
          <motion.img
            src={cftMachineImg}
            alt=""
            className="machine-image machine-image-cft"
            variants={collageImageVariants}
          />
          <motion.img
            src={cvBiaxialMachineImg}
            alt=""
            className="machine-image machine-image-cv"
            variants={collageImageVariants}
          />
          <motion.img
            src={lpBiaxialMachineImg}
            alt=""
            className="machine-image machine-image-lp"
            variants={collageImageVariants}
          />
        </motion.div>
      </div>

      <div className={decorativeVisible ? "decorative-layer decorative-layer-visible" : "decorative-layer"}>
        <ParticlesBackground />
        <div className="glow-circle glow-circle-primary"></div>
        <div className="glow-circle glow-circle-secondary"></div>
        <div className="blur-circle blur-circle-one"></div>
        <div className="blur-circle blur-circle-two"></div>
        <div className="blur-circle blur-circle-three"></div>
      </div>

      <div className="right-content-column">
        <InnovationHighlight ref={innovationRef} />

        <div className="wheel-wrapper">
          <motion.div
            className="wheel-spin-layer"
            animate={rotating ? { rotate: 360 } : { rotate: 0 }}
            transition={
              rotating
                ? {
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                  }
                : {
                    duration: 0,
                  }
            }
          >
            <img
              ref={wheelImgRef}
              src={wheelImg}
              alt="Wheels India chrome wheel"
              className="wheel-image"
            />

            {sweeping && <span className="wheel-image-sweep" aria-hidden="true" />}

            <span ref={highlightRef} className="wheel-highlight-sweep" />

            {LOAD_POINTS.map((point, index) => (
              <span
                key={point.key}
                data-load-point={point.key}
                className={
                  attachedPoints && attachedPoints[index]
                    ? "load-point load-point-active"
                    : "load-point"
                }
                style={{ top: point.top, left: point.left }}
              />
            ))}
          </motion.div>
        </div>

        <motion.p
          className="product-testing-label"
          variants={labelContainerVariants}
          initial="hidden"
          animate={rotating ? "visible" : "hidden"}
        >
          {PRODUCT_TESTING_CHARS.map((char, index) => (
            <motion.span key={index} variants={labelCharVariants}>
              {char}
            </motion.span>
          ))}
        </motion.p>
      </div>
    </div>
  );
});

export default Wheel;