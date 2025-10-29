import React from "react";
import { Toast, ToastContainer } from "react-bootstrap";

export default function Notification({ show, onClose, message, bg }) {
  return (
    <ToastContainer position="top-end" className="p-3">
      <Toast
        onClose={onClose}
        show={show}
        delay={3000}
        autohide
        bg={bg || "success"}
      >
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
