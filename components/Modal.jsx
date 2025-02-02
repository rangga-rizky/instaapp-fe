// components/Modal.js
import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          max-width: 500px;
          width: 100%;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          position: relative;
        }
        .close-button {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          color: grey;
          border: none;
          font-size: 24px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Modal;