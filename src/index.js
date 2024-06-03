import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // Предполагая, что ваш компонент App находится в файле App.js
import './index.css'; // Предполагая, что у вас есть файл стилей

// Найдите элемент контейнера в вашем HTML
const container = document.getElementById('root');

// Создайте корневой элемент
const root = createRoot(container);

// Используйте root.render вместо ReactDOM.render
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
