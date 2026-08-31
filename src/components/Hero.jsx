import React, { forwardRef, useImperativeHandle, useRef } from "react";

// IntroAnimation reads hero.heading and hero.tagline directly, so the
// imperative handle exposes exactly that shape — two plain DOM nodes,
// not methods.
const Hero = forwardRef(function Hero(props, ref) {
  const headingRef = useRef(null);
  const taglineRef = useRef(null);

  useImperativeHandle(ref, () => ({
    heading: headingRef.current,
    tagline: taglineRef.current,
  }));

  return (
    <div className="hero-wrapper">
      <h1 ref={headingRef} className="hero-heading">
        Engineering Excellence
        <br />
        <span className="hero-heading-accent">for Modern Industries</span>
      </h1>
      <p ref={taglineRef} className="hero-tagline">
        Precision. Performance. Reliability.
      </p>
    </div>
  );
});

export default Hero;
