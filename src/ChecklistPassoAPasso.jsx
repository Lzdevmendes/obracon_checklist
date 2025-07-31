import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CameraCapture from './components/CameraCapture';
import './ChecklistPassoAPasso.css';

const ChecklistPassoAPasso = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const vehicleId = location.state?.vehicleId;
  
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [checklistData, setChecklistData] = useState({
    placa: '',
    dataHora: new Date().toISOString().slice(0, 16), // formato datetime-local
    observacoes: '',
    itensVerificados: {
      painelFuncionando: false,
      luzesIndicadoras: false,
      velocimetro: false,
      tacometro: false,
      combustivel: false,
      temperatura: false
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

  const handlePhotoCapture = (photoDataUrl) => {
    setCapturedPhoto(photoDataUrl);
    setShowCamera(false);
  };

  const handleSubmitChecklist = async () => {
    if (!capturedPhoto) {
      alert('Por favor, capture uma foto do painel antes de enviar.');
      return;
    }

    if (!checklistData.placa.trim()) {
      alert('Por favor, informe a placa do veículo.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Aqui será implementada a integração com o banco de dados
      const checklistCompleto = {
        vehicleId,
        ...checklistData,
        foto: capturedPhoto,
        timestamp: new Date().toISOString()
      };

      console.log('Dados do checklist:', checklistCompleto);
      
      // Simulação de envio (será substituído pela integração real)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Checklist enviado com sucesso!');
      navigate('/');
      
    } catch (error) {
      console.error('Erro ao enviar checklist:', error);
      alert('Erro ao enviar checklist. Tente novamente.');
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
        <h1>Checklist do Painel</h1>
      </header>

      <div className="checklist-content">
        <div className="vehicle-info">
          <h2>Veículo ID: {vehicleId || 'Não especificado'}</h2>
        </div>

        {/* Seção de captura de foto */}
        <div className="photo-section">
          <h3>📷 Foto do Painel de Instrumentos</h3>
          {!capturedPhoto ? (
            <div className="photo-placeholder">
              <p>Nenhuma foto capturada</p>
              <button 
                onClick={() => setShowCamera(true)}
                className="btn-camera"
              >
                📱 Abrir Câmera
              </button>
            </div>
          ) : (
            <div className="photo-preview">
              <img src={capturedPhoto} alt="Painel capturado" className="captured-photo" />
              <button 
                onClick={() => setShowCamera(true)}
                className="btn-retake-small"
              >
                🔄 Tirar Nova Foto
              </button>
            </div>
          )}
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
          <h3>✅ Itens Verificados</h3>
          
          <div className="checkbox-group">
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={checklistData.itensVerificados.painelFuncionando}
                onChange={(e) => handleCheckboxChange('painelFuncionando', e.target.checked)}
              />
              <span>Painel funcionando corretamente</span>
            </label>

            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={checklistData.itensVerificados.luzesIndicadoras}
                onChange={(e) => handleCheckboxChange('luzesIndicadoras', e.target.checked)}
              />
              <span>Luzes indicadoras funcionando</span>
            </label>

            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={checklistData.itensVerificados.velocimetro}
                onChange={(e) => handleCheckboxChange('velocimetro', e.target.checked)}
              />
              <span>Velocímetro funcionando</span>
            </label>

            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={checklistData.itensVerificados.tacometro}
                onChange={(e) => handleCheckboxChange('tacometro', e.target.checked)}
              />
              <span>Tacômetro funcionando</span>
            </label>

            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={checklistData.itensVerificados.combustivel}
                onChange={(e) => handleCheckboxChange('combustivel', e.target.checked)}
              />
              <span>Indicador de combustível funcionando</span>
            </label>

            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={checklistData.itensVerificados.temperatura}
                onChange={(e) => handleCheckboxChange('temperatura', e.target.checked)}
              />
              <span>Indicador de temperatura funcionando</span>
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
      {showCamera && (
        <CameraCapture
          onPhotoCapture={handlePhotoCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
};

export default ChecklistPassoAPasso;
