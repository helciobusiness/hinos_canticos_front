import React from 'react';
import { Link } from 'react-router-dom';
import { BookX, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', maxWidth: 480, margin: '0 auto' }}>
      <BookX size={56} color="var(--red-primary)" style={{ margin: '0 auto 16px' }} />
      <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: 8 }}>Página não encontrada</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: '0.95rem' }}>
        A página ou hino que procura não existe ou foi movido.
      </p>
      <Link to="/" className="btn btn-primary">
        <Home size={18} /> Voltar para o Início
      </Link>
    </div>
  );
};
