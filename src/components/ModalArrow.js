import React, { useState, useEffect, useRef } from 'react';

const ModalArrow = ({ arrow, blockData, incomingData, closeModal, updateArrowData, deleteArrow }) => {
    const [selectedRows, setSelectedRows] = useState(arrow.selectedData || []);
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                closeModal();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [closeModal]);

    useEffect(() => {
        setSelectedRows(arrow.selectedData || []);
    }, [arrow]);

    const handleRowSelection = (row) => {
        const isSelected = selectedRows.some(selectedRow => selectedRow.id === row.id);
        if (isSelected) {
            setSelectedRows(selectedRows.filter(selectedRow => selectedRow.id !== row.id));
        } else {
            setSelectedRows([...selectedRows, row]);
        }
    };

    const handleSave = () => {
        updateArrowData(arrow.id, { ...arrow, selectedData: selectedRows });
        closeModal();
    };

    return (
        <div className="Modal">
            <div className="ModalContent" ref={modalRef}>
                <span className="Close" onClick={closeModal}>&times;</span>
                <h2>Выберите строки для передачи</h2>
                <table className="MiniTable">
                    <thead>
                    <tr>
                        <th>Название</th>
                        <th>Содержание</th>
                        <th>Выбрать</th>
                    </tr>
                    </thead>
                    <tbody>
                    {blockData.concat(incomingData).map((row, index) => (
                        <tr key={index}>
                            <td>{row.col1}</td>
                            <td>{row.col2}</td>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedRows.some(selectedRow => selectedRow.id === row.id)}
                                    onChange={() => handleRowSelection(row)}
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="ModalFooter">
                    <button onClick={handleSave}>Сохранить</button>
                    <button onClick={() => deleteArrow(arrow.id)}>Удалить стрелку</button>
                </div>
            </div>
        </div>
    );
};

export default ModalArrow;
