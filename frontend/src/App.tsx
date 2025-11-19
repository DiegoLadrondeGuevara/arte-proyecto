// src/App.tsx (CORREGIDO)
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Auth/Login';
import RegisterPage from './pages/Auth/Register';
import ProtectedRoute from './components/common/ProtectedRoute';
import NavBar from './components/ui/NavBar'; 

// 🎯 IMPORTACIÓN DEL COMPONENTE REAL DE GENERACIÓN DE ARTE
import GenerateArtPage from '../src/pages/GenerateArt'; // <-- Asume que el archivo está en './pages/GenerateArtPage'

// Componentes temporales que no usaremos
const Dashboard = () => <h1>Dashboard Principal 👋</h1>;
// const GenerateArt = () => <h1>Generar Arte IA 🖼️</h1>; // <-- Eliminado o ignorado

function App() {
  return (
    <>
      <NavBar /> 
      
      <main style={{ 
          padding: '20px', 
          margin: '0 auto', 
          maxWidth: '1200px', 
          width: '95%' 
      }}> 
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Rutas Protegidas */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/generate" 
            element={
              <ProtectedRoute>
                {/* 🎯 CORRECCIÓN: Usar el componente COMPLETO */}
                <GenerateArtPage />
              </ProtectedRoute>
            } 
          />

          {/* 404 */}
          <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
        </Routes>
      </main>
    </>
  );
}

export default App;