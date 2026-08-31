import React, { forwardRef } from "react";

// Same pattern as InnovationHighlight — wheel.quote is a plain
// opacity target for GSAP.
const WheelQuote = forwardRef(function WheelQuote(props, ref) {
  return (
    <div ref={ref} className="wheel-quote" style={{ opacity: 0 }}>
      <p className="wheel-quote-main">Where Engineering Meets Motion.</p>
      <p className="wheel-quote-sub">Built to Move Industries Forward.</p>
    </div>
  );
});

export default WheelQuote;