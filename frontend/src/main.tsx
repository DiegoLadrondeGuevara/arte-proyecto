// src/main.tsx (MODIFICADO)
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './providers/AuthProvider.tsx'; // Importamos el AuthProvider

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* 🟢 ENVOLVEMOS TODA LA APP CON EL PROVEEDOR DE AUTENTICACIÓN */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);