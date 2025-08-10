import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const vehicles = [
    { id: 1, veiculo: 'Montana', placa: 'SUX-9E46', status: 'Funcionando', revisao: '15/01/2025' },
    { id: 2, veiculo: 'Strada', placa: 'FXX-3G05', status: 'Funcionando', revisao: '20/01/2025' },
    { id: 3, veiculo: 'Fiorino', placa: 'CWV-5E10', status: 'Funcionando', revisao: '10/02/2025' },
    { id: 4, veiculo: 'Polo', placa: 'FGK-2C31', status: 'Funcionando', revisao: '25/01/2025' },
    { id: 5, veiculo: 'Polo', placa: 'FTW-1H64', status: 'Funcionando', revisao: '30/01/2025' },
    { id: 6, veiculo: 'Bongo', placa: 'GDW-7C61', status: 'Funcionando', revisao: '05/02/2025' },
    { id: 7, veiculo: 'Strada Dupla', placa: 'GHZ-6J35', status: 'Funcionando', revisao: '12/02/2025' },
    { id: 8, veiculo: 'Strada Dupla', placa: 'GAX-4J52', status: 'Funcionando', revisao: '18/02/2025' },
    { id: 9, veiculo: 'Saveiro Robust', placa: 'SWH-1I55', status: 'Funcionando', revisao: '22/02/2025' },
    { id: 10, veiculo: 'Saveiro Simples', placa: 'SUX-8I75', status: 'Funcionando', revisao: '28/02/2025' },
    { id: 11, veiculo: 'Montana', placa: 'SVV-7D93', status: 'Funcionando', revisao: '05/03/2025' },
    { id: 12, veiculo: 'Saveiro Simples', placa: 'TJJ-7G92', status: 'Funcionando', revisao: '10/03/2025' },
    { id: 13, veiculo: 'Saveiro Simples', placa: 'TLO-1E94', status: 'Funcionando', revisao: '15/03/2025' },
    { id: 14, veiculo: 'Saveiro Simples', placa: 'TLW-3D89', status: 'Funcionando', revisao: '20/03/2025' }
  ];

  const handleSelectVehicle = (vehicleId) => {
    navigate('/checklist-passoapasso', { state: { vehicleId } });
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo">
          <img src="/logo192.png" alt="Logo" className="logo-image" />
          <span className="logo-text">Obracon - Veículos</span>
        </div>
        <h1 className="dashboard-title">Checklist Diário de Veículos</h1>
        <div className="user-info">
          <span className="welcome-text">Bem-vindo, {user?.name || 'Usuário'}!</span>
          <button className="logout-button" onClick={onLogout}>
            Sair
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="actions-bar">
          <button
            className="history-button"
            onClick={() => navigate('/historico')}
          >
            📋 Ver Histórico de Checklists
          </button>
        </div>
        
        <div className="table-container">
          <table className="vehicles-table">
            <thead>
              <tr>
                <th>Veículo</th>
                <th>Placa</th>
                <th>Status de Funcionamento</th>
                <th>Revisão</th>
                <th>Selecionar</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td>{vehicle.veiculo}</td>
                  <td>{vehicle.placa}</td>
                  <td>
                    <span className={`status ${vehicle.status === 'Funcionando' ? 'status-working' : 'status-maintenance'}`}>
                      {vehicle.status}
                    </span>
                  </td>
                  <td>{vehicle.revisao}</td>
                  <td>
                    <button 
                      className="select-button"
                      onClick={() => handleSelectVehicle(vehicle.id)}
                    >
                      Selecionar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;