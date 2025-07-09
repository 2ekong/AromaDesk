import React, { useState, useEffect } from "react";

const Toast = ({ message, type = "info", duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const getToastClass = () => {
    const baseClass = "toast align-items-center text-white border-0";
    switch (type) {
      case "success":
        return `${baseClass} bg-success`;
      case "error":
        return `${baseClass} bg-danger`;
      case "warning":
        return `${baseClass} bg-warning`;
      default:
        return `${baseClass} bg-info`;
    }
  };

  return (
    <div
      className={getToastClass()}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 9999,
        minWidth: 300,
      }}
    >
      <div className="d-flex">
        <div className="toast-body">{message}</div>
        <button
          type="button"
          className="btn-close btn-close-white me-2 m-auto"
          data-bs-dismiss="toast"
          aria-label="Close"
          onClick={() => {
            setIsVisible(false);
            if (onClose) onClose();
          }}
        ></button>
      </div>
    </div>
  );
};

export default Toast;
