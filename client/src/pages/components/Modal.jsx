const Modal = ({ title, onClose, children, footer }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
        <h3 className="font-semibold">{title}</h3>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
          &times;
        </button>
      </div>
      <div className="px-5 py-4">{children}</div>
      {footer && <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-200">{footer}</div>}
    </div>
  </div>
);

export default Modal;