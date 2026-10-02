import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatHinoNumero } from '../utils/format';
import { BookOpen } from 'lucide-react';

interface RangeGroup {
  label: string;
  start: number;
  end: number;
}

const RANGES: RangeGroup[] = [
  { label: '001 – 100', start: 1, end: 100 },
  { label: '101 – 200', start: 101, end: 200 },
  { label: '201 – 300', start: 201, end: 300 },
  { label: '301 – 400', start: 301, end: 400 },
  { label: '401 – 500', start: 401, end: 500 },
  { label: '501 – 581', start: 501, end: 581 },
];

export const NumericIndexView: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState<RangeGroup>(RANGES[0]);

  // Gera os números do intervalo selecionado
  const numbers = Array.from(
    { length: selectedRange.end - selectedRange.start + 1 },
    (_, i) => selectedRange.start + i
  );

  return (
    <div className="numeric-index-container">
      {/* Seletor de Faixas (Centenas) */}
      <div className="numeric-range-chips">
        {RANGES.map((rg) => {
          const active = rg.start === selectedRange.start;
          return (
            <button
              key={rg.label}
              type="button"
              onClick={() => setSelectedRange(rg)}
              className={`range-chip-btn ${active ? 'active' : ''}`}
            >
              {rg.label}
            </button>
          );
        })}
      </div>

      {/* Grid de Números */}
      <div className="numeric-badge-grid">
        {numbers.map((num) => (
          <Link
            key={num}
            to={`/hino/${formatHinoNumero(num)}`}
            className="numeric-badge-item"
            title={`Abrir Hino ${num}`}
          >
            <span className="badge-num">{formatHinoNumero(num)}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};
