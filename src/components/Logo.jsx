import React, { forwardRef } from "react";
import logoImg from "../assets/logos/wheels-india-logo.png";

// The intro treats this as a single opacity target — gsap.set/.to
// operate directly on the forwarded DOM node, so this component stays
// a plain, un-animated wrapper.
const Logo = forwardRef(function Logo(props, ref) {
  return (
    <div ref={ref} className="logo-wrapper">
      <img src={logoImg} alt="Wheels India Limited" className="logo-image" />
      <div className="logo-text">
        <span className="logo-title">WHEELS INDIA LIMITED</span>
      </div>
      <img src="/images/tsf.png" alt="TSF" className="logo-tsf-image" />
    </div>
  );
});

export default Logo;
