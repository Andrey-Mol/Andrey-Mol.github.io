import React, { useState } from 'react';

const TabTable = ({ tab, updateTabData }) => {
    const [newRow, setNewRow] = useState({ col1: '', col2: '', col3: '' });

    const handleInputChange = (e, rowIndex, col, type) => {
        const updatedData = tab[type].map((row, index) =>
            index === rowIndex ? { ...row, [col]: e.target.value } : row
        );
        updateTabData(tab.id, updatedData);
    };

    const handleNewRowChange = (e, col) => {
        setNewRow({ ...newRow, [col]: e.target.value });
    };

    const addNewRow = () => {
        const updatedData = [...tab.data, newRow];
        updateTabData(tab.id, updatedData);
        setNewRow({ col1: '', col2: '', col3: '' });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            addNewRow();
        }
    };

    const allData = [...tab.incomingData, ...tab.data];

    const total = allData.reduce((sum, row) => sum + parseFloat(row.col2 || 0), 0);
    const dataWithCoefficients = allData.map(row => ({
        ...row,
        col3: (parseFloat(row.col2 || 0) / total * 100).toFixed(2)
    }));

    return (
        <div className="TabTable">
            <h3>{tab.name}</h3>
            <table>
                <thead>
                <tr>
                    <th>Название</th>
                    <th>Содержание</th>
                    <th>Коэффициенты</th>
                </tr>
                </thead>
                <tbody>
                {dataWithCoefficients.slice(0, tab.incomingData.length).map((row, index) => (
                    <tr key={`incoming-${index}`}>
                        <td className="readOnly">{row.col1}</td>
                        <td className="readOnly">{row.col2}</td>
                        <td className="readOnly">{row.col3}</td>
                    </tr>
                ))}
                {tab.data.map((row, index) => (
                    <tr key={`data-${index}`}>
                        <td>
                            <input
                                type="text"
                                value={row.col1}
                                onChange={(e) => handleInputChange(e, index, 'col1', 'data')}
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                value={row.col2}
                                onChange={(e) => handleInputChange(e, index, 'col2', 'data')}
                            />
                        </td>
                        <td className="readOnly">{dataWithCoefficients[tab.incomingData.length + index].col3}</td>
                    </tr>
                ))}
                <tr>
                    <td>
                        <input
                            type="text"
                            value={newRow.col1}
                            onChange={(e) => handleNewRowChange(e, 'col1')}
                            onKeyPress={handleKeyPress}
                        />
                    </td>
                    <td>
                        <input
                            type="text"
                            value={newRow.col2}
                            onChange={(e) => handleNewRowChange(e, 'col2')}
                            onKeyPress={handleKeyPress}
                        />
                    </td>
                    <td className="readOnly">{newRow.col3}</td>
                </tr>
                </tbody>
            </table>
            <button onClick={addNewRow}>Добавить строку</button>
        </div>
    );
};

export default TabTable;