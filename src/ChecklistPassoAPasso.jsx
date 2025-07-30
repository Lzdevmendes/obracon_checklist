import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ChecklistPassoAPasso = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const vehicleId = location.state?.vehicleId;

  return (
    <div style={{ 
      padding: '2rem', 
      textAlign: 'center',
      minHeight: '100vh',
      backgroundColor: 'white'
    }}>
      <h1 style={{ color: '#007BFF', marginBottom: '2rem' }}>
        Checklist Passo a Passo
      </h1>
      
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#333' }}>
        Checklist para o veículo ID: {vehicleId || 'Não especificado'}
      </p>
      
      <div style={{ 
        background: '#f8f9fa', 
        padding: '2rem', 
        borderRadius: '8px',
        maxWidth: '600px',
        margin: '0 auto',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          Esta página será implementada com o checklist detalhado do veículo selecionado.
        </p>
        
        <button 
          onClick={() => navigate('/')}
          style={{
            backgroundColor: '#FFA500',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#e6940a'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#FFA500'}
        >
          Voltar ao Dashboard
        </button>
      </div>
    </div>
  );
};

export default ChecklistPassoAPasso;