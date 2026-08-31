import React, { forwardRef } from "react";

const InnovationHighlight = forwardRef(function InnovationHighlight(props, ref) {
  return (
    <div ref={ref} className="innovation-highlight" style={{ opacity: 0 }}>
      <span className="innovation-badge">
        <span className="innovation-badge-ring"></span>
      </span>
      <h3 className="innovation-title">&ldquo;INNOVATION&rdquo;</h3>
      <p className="innovation-subtitle">Driving Tomorrow Through Engineering</p>
      <p className="innovation-tags">
        Advanced R&amp;D <span className="innovation-dot">•</span> Smart Manufacturing{" "}
        <span className="innovation-dot">•</span> Sustainability
      </p>
    </div>
  );
});

export default InnovationHighlight;