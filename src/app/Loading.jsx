import React, { useState, useEffect } from "react";
import "./Loading.css";

const Loading = ({ timeout = 20000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), timeout);
    return () => clearTimeout(timer);
  }, [timeout]);

  if (!visible) return null;

  return (
    <div className="modern-loading-overlay">
      <div className="modern-spinner" />
    </div>
  );
};

export default Loading;
