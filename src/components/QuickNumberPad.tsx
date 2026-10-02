import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hash, ArrowRight, Delete, X, Sparkles, BookOpen } from 'lucide-react';
import { formatHinoNumero } from '../utils/format';
import { getOfflineHinoByNumero } from '../services/offline/offlineDatabase';

interface QuickNumberPadProps {
  onClose?: () => void;
  isModal?: boolean;
}

export const QuickNumberPad: React.FC<QuickNumberPadProps> = ({ onClose, isModal = false }) => {
  const [numero, setNumero] = useState('');
  const [previewTitle, setPreviewTitle] = useState<string | null>(null);
  const [showKeypad, setShowKeypad] = useState(isModal);
  const navigate = useNavigate();

  // Atualiza a prévia do título do hino em tempo real conforme digita o número
  useEffect(() => {
    const num = parseInt(numero, 10);
    if (!isNaN(num) && num >= 1 && num <= 581) {
      let isCurrent = true;
      getOfflineHinoByNumero(num).then((h) => {
        if (isCurrent) {
          setPreviewTitle(h ? h.titulo : null);
        }
      });
      return () => {
        isCurrent = false;
      };
    } else {
      setPreviewTitle(null);
    }
  }, [numero]);

  const handleOpen = (targetNum?: number) => {
    const num = targetNum ?? parseInt(numero, 10);
    if (!isNaN(num) && num >= 1 && num <= 581) {
      navigate(`/hino/${formatHinoNumero(num)}`);
      setNumero('');
      setPreviewTitle(null);
      if (onClose) onClose();
    }
  };

  const handleKeyPress = (digit: string) => {
    if (numero.length < 3) {
      const next = numero + digit;
      const parsed = parseInt(next, 10);
      if (parsed <= 581) {
        setNumero(next);
      }
    }
  };

  const handleBackspace = () => {
    setNumero((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setNumero('');
    setPreviewTitle(null);
  };

  return (
    <div className={`quick-pad-container ${isModal ? 'modal-mode' : ''}`}>
      {/* Barra de entrada superior */}
      <div className="quick-pad-display-row">
        <div className="quick-pad-input-box">
          <Hash size={18} className="quick-pad-hash-icon" />
          <input
            type="number"
            min="1"
            max="581"
            value={numero}
            onChange={(e) => {
              const val = e.target.value.slice(0, 3);
              const parsed = parseInt(val, 10);
              if (!val || (!isNaN(parsed) && parsed <= 581)) {
                setNumero(val);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleOpen();
              }
            }}
            placeholder="Nº do hino (1 a 581)..."
            aria-label="Digitar número do hino"
          />

          {numero && (
            <button
              type="button"
              onClick={handleClear}
              className="quick-pad-clear-btn"
              title="Limpar número"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => handleOpen()}
          disabled={!numero || parseInt(numero, 10) < 1 || parseInt(numero, 10) > 581}
          className="btn btn-primary quick-pad-go-btn"
          aria-label="Abrir hino"
        >
          <span>Abrir</span>
          <ArrowRight size={15} />
        </button>
      </div>

      {/* Prévia do Hino em tempo real */}
      {previewTitle && (
        <div
          onClick={() => handleOpen()}
          className="quick-pad-preview-card"
          role="button"
          tabIndex={0}
          title="Toque para abrir este hino"
        >
          <div className="quick-pad-preview-badge">Hino {parseInt(numero, 10)}</div>
          <div className="quick-pad-preview-title">{previewTitle}</div>
          <BookOpen size={16} color="var(--red-primary)" />
        </div>
      )}

      {/* Botão de alternância do Teclado Tátil */}
      {!isModal && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
          <button
            type="button"
            onClick={() => setShowKeypad(!showKeypad)}
            className="quick-pad-toggle-keypad-btn"
          >
            {showKeypad ? 'Ocultar Teclado Tátil' : 'Teclado Numérico Tátil'}
          </button>
        </div>
      )}

      {/* Teclado Numérico Tátil (Grid 3x4) */}
      {showKeypad && (
        <div className="quick-keypad-grid">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeyPress(digit)}
              className="keypad-btn"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClear}
            className="keypad-btn keypad-func-btn"
            title="Limpar"
          >
            C
          </button>
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="keypad-btn"
            disabled={!numero}
          >
            0
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            className="keypad-btn keypad-func-btn"
            title="Apagar dígito"
          >
            <Delete size={18} />
          </button>
        </div>
      )}
    </div>
  );
};
