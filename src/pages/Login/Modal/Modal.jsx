import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import styles from './Modal.module.css';

const Modal = ({ isOpen, closeModal, children }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={closeModal}>
                    <FontAwesomeIcon icon={faChevronLeft} /> {/* 뒤로 가기 아이콘 */}
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
