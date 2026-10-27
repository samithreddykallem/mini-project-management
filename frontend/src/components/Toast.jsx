import { useEffect } from "react";
import { AlertCircleIcon, CheckCircleIcon, CloseIcon } from "./Icons";

export function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isError = toast.type === "error";

  return (
    <div className={`toast-notification ${isError ? "toast-error" : "toast-success"}`}>
      <div className="toast-icon">
        {isError ? <AlertCircleIcon size={20} /> : <CheckCircleIcon size={20} />}
      </div>
      <div className="toast-content">
        <p className="toast-message">{toast.message}</p>
      </div>
      <button className="toast-close" onClick={onClose} aria-label="Dismiss">
        <CloseIcon size={16} />
      </button>
    </div>
  );
}
