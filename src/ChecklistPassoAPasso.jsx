import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CameraCapture from './components/CameraCapture';
import { saveChecklist } from './firebase/checklistService';
import './ChecklistPassoAPasso.css';

const ChecklistPassoAPasso = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const vehicleId = location.state?.vehicleId;
  
  const [showCamera, setShowCamera] = useState(false);
  const [currentPhotoType, setCurrentPhotoType] = useState(null);
  const [capturedPhotos, setCapturedPhotos] = useState({
    painel: null,
    frontal: null,
    lateralDireita: null,
    lateralEsquerda: null,
    traseira: null
  });
  const [checklistData, setChecklistData] = useState({
    placa: '',
    dataHora: (() => {
      const now = new Date();
      // Ajusta para o fuso horário do Brasil (UTC-3)
      const brasilTime = new Date(now.getTime() - (3 * 60 * 60 * 1000));
      return brasilTime.toISOString().slice(0, 16);
    })(),
    observacoes: '',
    itensVerificados: {
      carcaca: false,
      luzesGerais: false,
      pneus: false,
      cacamba: false,
      nivelGasolina: false
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setChecklistData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (item, checked) => {
    setChecklistData(prev => ({
      ...prev,
      itensVerificados: {
        ...prev.itensVerificados,
        [item]: checked
      }
    }));
  };

  const photoTypes = [
    { key: 'painel', label: 'Painel de Instrumentos', icon: '📊' },
    { key: 'frontal', label: 'Parte Frontal', icon: '🚗' },
    { key: 'lateralDireita', label: 'Lateral Direita', icon: '➡️' },
    { key: 'lateralEsquerda', label: 'Lateral Esquerda', icon: '⬅️' },
    { key: 'traseira', label: 'Parte Traseira', icon: '🔙' }
  ];

  const handlePhotoCapture = (photoDataUrl) => {
    if (currentPhotoType) {
      setCapturedPhotos(prev => ({
        ...prev,
        [currentPhotoType]: photoDataUrl
      }));
    }
    setShowCamera(false);
    setCurrentPhotoType(null);
  };

  const openCamera = (photoType) => {
    setCurrentPhotoType(photoType);
    setShowCamera(true);
  };

  const handleSubmitChecklist = async () => {
    // Verificar se todas as fotos foram capturadas
    const missingPhotos = photoTypes.filter(type => !capturedPhotos[type.key]);
    if (missingPhotos.length > 0) {
      alert(`Por favor, capture as seguintes fotos: ${missingPhotos.map(p => p.label).join(', ')}`);
      return;
    }

    if (!checklistData.placa.trim()) {
      alert('Por favor, informe a placa do veículo.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Preparar dados completos do checklist
      const checklistCompleto = {
        vehicleId,
        ...checklistData,
        fotos: capturedPhotos,
        timestamp: new Date().toISOString()
      };

      console.log('Enviando checklist para Firebase:', checklistCompleto);
      
      // Salvar no Firebase
      const checklistId = await saveChecklist(checklistCompleto);
      
      console.log('Checklist salvo com sucesso! ID:', checklistId);
      alert('Checklist enviado e salvo com sucesso!');
      navigate('/');
      
    } catch (error) {
      console.error('Erro ao enviar checklist:', error);
      alert('Erro ao enviar checklist: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checklist-container">
      <header className="checklist-header">
        <button 
          onClick={() => navigate('/')}
          className="btn-back"
        >
          ← Voltar
        </button>
      </header>

      <div className="checklist-content">
        <div className="vehicle-info">
          <h2>Veículo ID: {vehicleId || 'Não especificado'}</h2>
        </div>

        {/* Seção de captura de fotos */}
        <div className="photos-section">
          <h3>📷 Fotos do Veículo</h3>
          <p className="photos-instruction">Capture fotos de todas as partes do veículo:</p>
          
          <div className="photos-grid">
            {photoTypes.map((photoType) => (
              <div key={photoType.key} className="photo-item">
                <div className="photo-header">
                  <span className="photo-icon">{photoType.icon}</span>
                  <span className="photo-label">{photoType.label}</span>
                </div>
                
                {!capturedPhotos[photoType.key] ? (
                  <div className="photo-placeholder">
                    <p>Nenhuma foto</p>
                    <button
                      onClick={() => openCamera(photoType.key)}
                      className="btn-camera-small"
                    >
                      📱 Capturar
                    </button>
                  </div>
                ) : (
                  <div className="photo-preview-small">
                    <img
                      src={capturedPhotos[photoType.key]}
                      alt={`${photoType.label} capturada`}
                      className="captured-photo-small"
                    />
                    <button
                      onClick={() => openCamera(photoType.key)}
                      className="btn-retake-tiny"
                    >
                      🔄
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="photos-progress">
            <span>Progresso: {Object.values(capturedPhotos).filter(Boolean).length}/{photoTypes.length} fotos</span>
          </div>
        </div>

        {/* Formulário de dados básicos */}
        <div className="form-section">
          <h3>📋 Dados do Checklist</h3>
          
          <div className="form-group">
            <label htmlFor="placa">Placa do Veículo *</label>
            <input
              type="text"
              id="placa"
              value={checklistData.placa}
              onChange={(e) => handleInputChange('placa', e.target.value.toUpperCase())}
              placeholder="ABC-1234"
              maxLength="8"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="dataHora">Data e Hora *</label>
            <input
              type="datetime-local"
              id="dataHora"
              value={checklistData.dataHora}
              onChange={(e) => handleInputChange('dataHora', e.target.value)}
              required
            />
            <small style={{ color: '#666', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              📅 Data e hora atual do Brasil automaticamente preenchidas
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="observacoes">Observações</label>
            <textarea
              id="observacoes"
              value={checklistData.observacoes}
              onChange={(e) => handleInputChange('observacoes', e.target.value)}
              placeholder="Observações adicionais sobre o painel..."
              rows="3"
            />
          </div>
        </div>

        {/* Checklist de itens */}
        <div className="checklist-items">
          <h3>✅Itens Verificados</h3>
          
          <div className="checkbox-group">
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={checklistData.itensVerificados.carcaca}
                onChange={(e) => handleCheckboxChange('carcaca', e.target.checked)}
              />
              <span>🚗 Carcaça - Verificar se não há amassados</span>
            </label>

            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={checklistData.itensVerificados.luzesGerais}
                onChange={(e) => handleCheckboxChange('luzesGerais', e.target.checked)}
              />
              <span>💡 Luzes em geral - Funcionamento adequado</span>
            </label>

            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={checklistData.itensVerificados.pneus}
                onChange={(e) => handleCheckboxChange('pneus', e.target.checked)}
              />
              <span>🛞 Pneus - Saúde e calibragem adequadas</span>
            </label>

            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={checklistData.itensVerificados.cacamba}
                onChange={(e) => handleCheckboxChange('cacamba', e.target.checked)}
              />
              <span>📦 Caçamba - Sem objetos que coloquem a viagem em risco</span>
            </label>

            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={checklistData.itensVerificados.nivelGasolina}
                onChange={(e) => handleCheckboxChange('nivelGasolina', e.target.checked)}
              />
              <span>⛽ Nível de gasolina - Suficiente, não necessita abastecimento</span>
            </label>
          </div>
        </div>

        {/* Botão de envio */}
        <div className="submit-section">
          <button
            onClick={handleSubmitChecklist}
            disabled={isSubmitting}
            className="btn-submit"
          >
            {isSubmitting ? 'Enviando...' : '📤 Enviar Checklist'}
          </button>
        </div>
      </div>

      {/* Modal da câmera */}
      {showCamera && currentPhotoType && (
        <CameraCapture
          photoType={currentPhotoType}
          photoLabel={photoTypes.find(p => p.key === currentPhotoType)?.label}
          onPhotoCapture={handlePhotoCapture}
          onClose={() => {
            setShowCamera(false);
            setCurrentPhotoType(null);
          }}
        />
      )}
    </div>
  );
};

export default ChecklistPassoAPasso;
