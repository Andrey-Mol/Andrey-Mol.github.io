import React, { useRef, useEffect } from 'react';

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onCancel();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onCancel]);

    return (
        <div className="Modal">
            <div className="ModalContent" ref={modalRef}>
                <p>{message}</p>
                <div className="ModalFooter">
                    <button onClick={onConfirm}>Подтвердить</button>
                    <button onClick={onCancel}>Отмена</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
