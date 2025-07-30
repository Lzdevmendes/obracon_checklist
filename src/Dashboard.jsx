import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  // Mock data for 14 vehicles
  const vehicles = [
    { id: 1, veiculo: 'Fiat Uno', placa: 'ABC-1234', status: 'Funcionando', revisao: '15/01/2025' },
    { id: 2, veiculo: 'Volkswagen Gol', placa: 'DEF-5678', status: 'Funcionando', revisao: '20/01/2025' },
    { id: 3, veiculo: 'Chevrolet Onix', placa: 'GHI-9012', status: 'Manutenção', revisao: '10/02/2025' },
    { id: 4, veiculo: 'Ford Ka', placa: 'JKL-3456', status: 'Funcionando', revisao: '25/01/2025' },
    { id: 5, veiculo: 'Hyundai HB20', placa: 'MNO-7890', status: 'Funcionando', revisao: '30/01/2025' },
    { id: 6, veiculo: 'Renault Sandero', placa: 'PQR-1357', status: 'Funcionando', revisao: '05/02/2025' },
    { id: 7, veiculo: 'Fiat Argo', placa: 'STU-2468', status: 'Funcionando', revisao: '12/02/2025' },
    { id: 8, veiculo: 'Toyota Etios', placa: 'VWX-9753', status: 'Funcionando', revisao: '18/02/2025' },
    { id: 9, veiculo: 'Nissan March', placa: 'YZA-8642', status: 'Manutenção', revisao: '22/02/2025' },
    { id: 10, veiculo: 'Peugeot 208', placa: 'BCD-1975', status: 'Funcionando', revisao: '28/02/2025' },
    { id: 11, veiculo: 'Honda Fit', placa: 'EFG-3086', status: 'Funcionando', revisao: '05/03/2025' },
    { id: 12, veiculo: 'Chevrolet Prisma', placa: 'HIJ-4197', status: 'Funcionando', revisao: '10/03/2025' },
    { id: 13, veiculo: 'Volkswagen Voyage', placa: 'KLM-5208', status: 'Funcionando', revisao: '15/03/2025' },
    { id: 14, veiculo: 'Fiat Mobi', placa: 'NOP-6319', status: 'Manutenção', revisao: '20/03/2025' }
  ];

  const handleSelectVehicle = (vehicleId) => {
    navigate('/checklist-passoapasso', { state: { vehicleId } });
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo">
          <img src="/logo192.png" alt="Logo" className="logo-image" />
          <span className="logo-text">Obracon</span>
        </div>
        <h1 className="dashboard-title">Checklist Diário de Veículos</h1>
      </header>

      <main className="dashboard-main">
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