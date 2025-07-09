import React from "react";
import { Modal, Button } from "react-bootstrap";

const ConfirmModal = ({ show, onHide, onConfirm, message }) => {
  if (!show) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.4)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999
    }}>
      <div style={{
        background: "white",
        padding: "2rem",
        borderRadius: "8px",
        minWidth: "300px",
        maxWidth: "90%",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        textAlign: "center"
      }}>
        <h4 style={{ marginBottom: "1rem" }}>확인</h4>
        <p style={{ marginBottom: "1.5rem" }}>{message}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
          <Button variant="secondary" onClick={onHide}>아니요</Button>
          <Button variant="danger" onClick={onConfirm}>네, 취소할게요</Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
