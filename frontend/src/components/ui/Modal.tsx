import { type ReactNode, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-[#ece1d0] shadow-[0_2px_16px_rgba(61,5,12,0.18)] w-full max-w-md max-h-[90vh] overflow-y-auto p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          {title && <h2 className="text-lg font-semibold text-ink">{title}</h2>}
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-ink/60 hover:text-brand hover:bg-brand/5 transition-colors ml-auto"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
