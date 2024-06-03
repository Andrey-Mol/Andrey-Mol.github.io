import React, { useState, useRef, useEffect } from 'react';
import './ModalBlock.css';

const ModalTab = ({ block, closeModal, renameBlock, deleteBlock }) => {
    const [newName, setNewName] = useState(block.name);
    const [showCoefficients, setShowCoefficients] = useState(true);
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

    const handleSave = () => {
        renameBlock(block.id, newName);
        closeModal();
    };

    const handleDelete = () => {
        deleteBlock(block.id);
        closeModal();
    };

    const toggleCoefficients = () => {
        setShowCoefficients(!showCoefficients);
    };

    return (
        <div className="Modal">
            <div className="ModalContent" ref={modalRef}>
                <span className="Close" onClick={closeModal}>&times;</span>
                <div className="ModalHeader">
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                </div>
                <div className="Switch">
                    <label>
                        <input type="checkbox" checked={showCoefficients} onChange={toggleCoefficients} />
                        Показать коэффициенты
                    </label>
                </div>
                <table className="MiniTable">
                    <thead>
                    <tr>
                        <th>Название</th>
                        <th>Содержание</th>
                        {showCoefficients && <th>Коэффициенты</th>}
                    </tr>
                    </thead>
                    <tbody>
                    {block.incomingData.map((row, index) => (
                        <tr key={`incoming-${index}`}>
                            <td>{row.col1}</td>
                            <td>{row.col2}</td>
                            {showCoefficients && <td>{row.col3}</td>}
                        </tr>
                    ))}
                    {block.data.map((row, index) => (
                        <tr key={`data-${index}`}>
                            <td>{row.col1}</td>
                            <td>{row.col2}</td>
                            {showCoefficients && <td>{row.col3}</td>}
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="ModalFooter">
                    <button onClick={handleSave}>Сохранить</button>
                    <button onClick={handleDelete}>Удалить блок</button>
                </div>
            </div>
        </div>
    );
};

export default ModalTab;
