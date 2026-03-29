import { createContext, useContext, useState } from "react";

const ToastContext = createContext(null);

let toastCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const showToast = (message, tone = "success") => {
    const id = ++toastCounter;
    setToasts((current) => [...current, { id, message, tone }]);
    window.setTimeout(() => removeToast(id), 2400);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[min(92vw,360px)] flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-2xl border px-4 py-3 text-sm font-semibold text-white shadow-xl transition duration-300 animate-[toast-in_0.25s_ease] ${
              toast.tone === "error"
                ? "border-rose-400 bg-rose-500"
                : "border-teal-400 bg-slate-950"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
};
