import React from "react";

export default function Token({ children }) {
  return (
    <span
      style={{
        width: "50px",
        padding: "10px",
        borderRadius: "7px",
        height: "50px",
        background: "var(--accent)",
      }}
    >
      {children}
    </span>
  );
}
