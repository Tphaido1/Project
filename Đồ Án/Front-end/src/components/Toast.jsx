import { useEffect } from "react";
import { useToast } from "../context/ToastContext";

const Toast = () => {
  const { toasts, removeToast } = useToast();

  useEffect(() => {}, [toasts]);

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`} onClick={() => removeToast(t.id)}>
          <div className="toast-message">{t.message}</div>
        </div>
      ))}
    </div>
  );
};

export default Toast;
