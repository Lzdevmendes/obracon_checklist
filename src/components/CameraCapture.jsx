import React, { useState, useRef, useEffect, useCallback } from 'react';
import './CameraCapture.css';

const CameraCapture = ({ onPhotoCapture, onClose }) => {
  const [stream, setStream] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    startCamera();
    return () => {
      // Função de cleanup inline para evitar dependências
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Para a câmera anterior se existir
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Câmera traseira em dispositivos móveis
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // Aguarda o vídeo carregar antes de remover o loading
        videoRef.current.onloadedmetadata = () => {
          setIsLoading(false);
        };
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Erro ao acessar a câmera:', err);
      setError('Não foi possível acessar a câmera. Verifique as permissões.');
      setIsLoading(false);
    }
  };


  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Define o tamanho do canvas igual ao vídeo
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Desenha o frame atual do vídeo no canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Converte para base64
    const photoDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedPhoto(photoDataUrl);
  };

  const confirmPhoto = () => {
    if (capturedPhoto && onPhotoCapture) {
      onPhotoCapture(capturedPhoto);
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
  };

  const handleClose = () => {
    stopCamera();
    setCapturedPhoto(null); // Limpa a foto capturada
    if (onClose) {
      onClose();
    }
  };

  if (error) {
    return (
      <div className="camera-container">
        <div className="camera-error">
          <h3>Erro na Câmera</h3>
          <p>{error}</p>
          <button onClick={handleClose} className="btn-close">
            Fechar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="camera-container">
      <div className="camera-header">
        <h3>Capturar Foto do Painel</h3>
        <button onClick={handleClose} className="btn-close">
          ✕
        </button>
      </div>

      <div className="camera-content">
        {isLoading && (
          <div className="camera-loading">
            <p>Carregando câmera...</p>
          </div>
        )}

        {!capturedPhoto ? (
          <div className="camera-preview">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="camera-video"
            />
            
            {/* Overlay do painel de instrumentos */}
            <div className="dashboard-overlay">
              <svg
                viewBox="0 0 400 300"
                className="dashboard-outline"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Contorno do painel principal */}
                <rect
                  x="50"
                  y="80"
                  width="300"
                  height="140"
                  rx="20"
                  ry="20"
                  fill="none"
                  stroke="#00ff00"
                  strokeWidth="3"
                  strokeDasharray="10,5"
                />
                
                {/* Círculo do velocímetro */}
                <circle
                  cx="120"
                  cy="150"
                  r="35"
                  fill="none"
                  stroke="#00ff00"
                  strokeWidth="2"
                  strokeDasharray="5,3"
                />
                
                {/* Círculo do tacômetro */}
                <circle
                  cx="280"
                  cy="150"
                  r="35"
                  fill="none"
                  stroke="#00ff00"
                  strokeWidth="2"
                  strokeDasharray="5,3"
                />
                
                {/* Display central */}
                <rect
                  x="180"
                  y="130"
                  width="40"
                  height="40"
                  rx="5"
                  ry="5"
                  fill="none"
                  stroke="#00ff00"
                  strokeWidth="2"
                  strokeDasharray="3,2"
                />
                
                {/* Texto de instrução */}
                <text
                  x="200"
                  y="50"
                  textAnchor="middle"
                  fill="#00ff00"
                  fontSize="14"
                  fontWeight="bold"
                >
                  Alinhe o painel dentro desta área
                </text>
              </svg>
            </div>

            <div className="camera-controls">
              <button onClick={capturePhoto} className="btn-capture">
                📷 Capturar
              </button>
            </div>
          </div>
        ) : (
          <div className="photo-preview">
            <img src={capturedPhoto} alt="Foto capturada" className="captured-image" />
            <div className="photo-controls">
              <button onClick={retakePhoto} className="btn-retake">
                🔄 Tirar Novamente
              </button>
              <button onClick={confirmPhoto} className="btn-confirm">
                ✓ Confirmar
              </button>
            </div>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default CameraCapture;