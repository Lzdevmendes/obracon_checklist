import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllChecklists, getChecklistsByPlaca } from './firebase/checklistService';
import './ChecklistHistory.css';

const ChecklistHistory = () => {
  const navigate = useNavigate();
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchPlaca, setSearchPlaca] = useState('');
  const [selectedChecklist, setSelectedChecklist] = useState(null);

  // Carregar todos os checklists ao montar o componente
  useEffect(() => {
    loadChecklists();
  }, []);

  const loadChecklists = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllChecklists();
      setChecklists(data);
    } catch (err) {
      setError('Erro ao carregar histórico: ' + err.message);
      console.error('Erro ao carregar checklists:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByPlaca = async () => {
    if (!searchPlaca.trim()) {
      loadChecklists();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getChecklistsByPlaca(searchPlaca);
      setChecklists(data);
    } catch (err) {
      setError('Erro ao buscar por placa: ' + err.message);
      console.error('Erro ao buscar por placa:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Data não disponível';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Data inválida';
    }
  };

  const getStatusColor = (itensVerificados) => {
    if (!itensVerificados) return '#f44336';
    
    const totalItens = Object.keys(itensVerificados).length;
    const itensOk = Object.values(itensVerificados).filter(Boolean).length;
    
    if (itensOk === totalItens) return '#4caf50';
    if (itensOk > totalItens / 2) return '#ff9800';
    return '#f44336';
  };

  const getStatusText = (itensVerificados) => {
    if (!itensVerificados) return 'Sem dados';
    
    const totalItens = Object.keys(itensVerificados).length;
    const itensOk = Object.values(itensVerificados).filter(Boolean).length;
    
    return `${itensOk}/${totalItens} itens OK`;
  };

  const openChecklistDetails = (checklist) => {
    setSelectedChecklist(checklist);
  };

  const closeChecklistDetails = () => {
    setSelectedChecklist(null);
  };

  if (loading) {
    return (
      <div className="history-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Carregando histórico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <header className="history-header">
        <button 
          onClick={() => navigate('/')}
          className="btn-back"
        >
          ← Voltar ao Dashboard
        </button>
        <h1>Histórico de Checklists</h1>
      </header>

      {/* Barra de pesquisa */}
      <div className="search-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar por placa (ex: ABC-1234)"
            value={searchPlaca}
            onChange={(e) => setSearchPlaca(e.target.value.toUpperCase())}
            onKeyPress={(e) => e.key === 'Enter' && handleSearchByPlaca()}
          />
          <button onClick={handleSearchByPlaca} className="btn-search">
            🔍 Buscar
          </button>
          <button onClick={loadChecklists} className="btn-clear">
            🔄 Todos
          </button>
        </div>
      </div>

      {/* Mensagem de erro */}
      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
          <button onClick={loadChecklists} className="btn-retry">
            Tentar novamente
          </button>
        </div>
      )}

      {/* Lista de checklists */}
      <div className="checklists-section">
        {checklists.length === 0 ? (
          <div className="empty-state">
            <p>📋 Nenhum checklist encontrado</p>
            {searchPlaca && (
              <button onClick={loadChecklists} className="btn-show-all">
                Ver todos os checklists
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="results-info">
              <p>📊 {checklists.length} checklist(s) encontrado(s)</p>
            </div>
            
            <div className="checklists-grid">
              {checklists.map((checklist) => (
                <div key={checklist.id} className="checklist-card">
                  <div className="card-header">
                    <h3>🚗 {checklist.placa}</h3>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(checklist.itensVerificados) }}
                    >
                      {getStatusText(checklist.itensVerificados)}
                    </span>
                  </div>
                  
                  <div className="card-content">
                    <p><strong>📅 Data:</strong> {formatDateTime(checklist.dataHora)}</p>
                    <p><strong>🆔 Veículo ID:</strong> {checklist.vehicleId || 'N/A'}</p>
                    
                    {checklist.observacoes && (
                      <p><strong>📝 Observações:</strong> {checklist.observacoes}</p>
                    )}
                  </div>
                  
                  <div className="card-actions">
                    <button 
                      onClick={() => openChecklistDetails(checklist)}
                      className="btn-details"
                    >
                      👁️ Ver Detalhes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal de detalhes */}
      {selectedChecklist && (
        <div className="modal-overlay" onClick={closeChecklistDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalhes do Checklist</h2>
              <button onClick={closeChecklistDetails} className="btn-close">
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="detail-section">
                <h3>📋 Informações Básicas</h3>
                <p><strong>Placa:</strong> {selectedChecklist.placa}</p>
                <p><strong>Data/Hora:</strong> {formatDateTime(selectedChecklist.dataHora)}</p>
                <p><strong>Veículo ID:</strong> {selectedChecklist.vehicleId || 'N/A'}</p>
                {selectedChecklist.observacoes && (
                  <p><strong>Observações:</strong> {selectedChecklist.observacoes}</p>
                )}
              </div>

              <div className="detail-section">
                <h3>✅ Itens Verificados</h3>
                <div className="items-list">
                  {selectedChecklist.itensVerificados && Object.entries(selectedChecklist.itensVerificados).map(([key, value]) => (
                    <div key={key} className={`item-status ${value ? 'ok' : 'not-ok'}`}>
                      <span className="item-icon">{value ? '✅' : '❌'}</span>
                      <span className="item-name">
                        {key === 'carcaca' && '🚗 Carcaça'}
                        {key === 'luzesGerais' && '💡 Luzes em geral'}
                        {key === 'pneus' && '🛞 Pneus'}
                        {key === 'cacamba' && '📦 Caçamba'}
                        {key === 'nivelGasolina' && '⛽ Nível de gasolina'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedChecklist.fotoURL && (
                <div className="detail-section">
                  <h3>📷 Foto do Painel</h3>
                  <div className="photo-container">
                    <img 
                      src={selectedChecklist.fotoURL} 
                      alt="Foto do painel" 
                      className="checklist-photo"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChecklistHistory;