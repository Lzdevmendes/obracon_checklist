import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './Login';
import Dashboard from './Dashboard';
import ChecklistPassoAPasso from './ChecklistPassoAPasso';
import ChecklistHistory from './ChecklistHistory';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  // Se não estiver logado, mostra a tela de login
  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLogin} />;
  }

  // Se estiver logado, mostra a interface principal com React Router
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard user={user} onLogout={handleLogout} />} />
          <Route path="/checklist-passoapasso" element={<ChecklistPassoAPasso />} />
          <Route path="/historico" element={<ChecklistHistory />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;