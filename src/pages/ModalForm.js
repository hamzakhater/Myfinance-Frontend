import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function ModalForm({ type, item, onClose, onSave }) {
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (item) {
      setDesc(item.description);
      setAmount(item.amount);
    } else {
      setDesc("");
      setAmount("");
    }
  }, [item]);

  const handleSubmit = () => {
    if (!desc || !amount) return;
    const data = {
      date: new Date().toISOString().split("T")[0],
      description: desc,
      amount: parseInt(amount),
    };
    onSave(data);
  };

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {item ? "Edit" : "Add"} {type === "income" ? "Income" : "Expense"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Amount</Form.Label>
          <Form.Control
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {item ? "Save" : "Add"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
