// Modal.js
import React from 'react';
import styles from './Modal.module.css';

const Modal = ({ isOpen, closeModal, children }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={closeModal}>X</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
