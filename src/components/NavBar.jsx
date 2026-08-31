import React, { forwardRef } from "react";

// Navigation items removed per request. The root element is gone
// entirely (component returns null) rather than left as an empty box,
// for a cleaner result. IntroAnimation's safeTo(masterTl, navBarEl, ...)
// already treats an unresolved ref as a no-op tween — no changes to
// IntroAnimation.jsx were required.
const NavBar = forwardRef(function NavBar(props, ref) {
  return null;
});

export default NavBar;