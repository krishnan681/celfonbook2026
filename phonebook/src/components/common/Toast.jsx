import { useEffect, useState } from "react";

const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setExiting(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div className={`toast toast-${type} ${exiting ? "toast-exit" : ""}`}>
      <span>{message}</span>
      <span className="toast-close" onClick={handleClose}>×</span>
    </div>
  );
};

export default Toast;