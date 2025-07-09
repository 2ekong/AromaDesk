import React from "react";
import "../../css/AdminMemberPage.css";

const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {children}
        <div style={{ textAlign: "right", marginTop: 20 }}>
          <button onClick={onClose}>확인</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
