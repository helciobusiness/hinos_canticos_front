import { describe, it, expect } from 'vitest';
import { normalizeText, highlightMatch } from '../src/utils/text';
import { formatHinoNumero, formatTimeAgo } from '../src/utils/format';

describe('Frontend Unit Tests', () => {
  describe('normalizeText', () => {
    it('deve remover acentos e normalizar para minúsculas', () => {
      expect(normalizeText('História')).toBe('historia');
      expect(normalizeText('CÂNTICOS & HINOS')).toBe('canticos & hinos');
      expect(normalizeText('coração, bênção, glória')).toBe('coracao, bencao, gloria');
      expect(normalizeText('')).toBe('');
    });
  });

  describe('highlightMatch', () => {
    it('deve identificar partes coincidentes no texto para destaque', () => {
      const parts = highlightMatch('A Linda História de Amor', 'historia');
      const matchPart = parts.find((p) => p.match);
      expect(matchPart).toBeDefined();
      expect(matchPart?.text.toLowerCase()).toBe('história');
    });

    it('deve retornar texto original se a busca for vazia', () => {
      const parts = highlightMatch('A divinal mensagem', '');
      expect(parts.length).toBe(1);
      expect(parts[0].match).toBe(false);
      expect(parts[0].text).toBe('A divinal mensagem');
    });
  });

  describe('formatHinoNumero', () => {
    it('deve preencher com zeros à esquerda no padrão de 3 dígitos', () => {
      expect(formatHinoNumero(1)).toBe('001');
      expect(formatHinoNumero(23)).toBe('023');
      expect(formatHinoNumero(100)).toBe('100');
      expect(formatHinoNumero(764)).toBe('764');
    });
  });

  describe('Offline Data & Search Logic', () => {
    it('deve validar correspondência de pesquisa por título sem acentos', () => {
      const query = normalizeText('bencao');
      const title = normalizeText('Eterna bênção há de ter');
      expect(title.includes(query)).toBe(true);
    });

    it('deve validar correspondência por número exato', () => {
      const query = '45';
      const targetNumero = 45;
      expect(parseInt(query, 10)).toBe(targetNumero);
    });

    it('deve encontrar correspondência em estrofes com trecho relevante', () => {
      const stanza = 'Que Deus amou ao mundo\nE deu-lhe um Salvador';
      const query = normalizeText('Salvador');
      const normalizedStanza = normalizeText(stanza);
      expect(normalizedStanza.includes(query)).toBe(true);
    });
  });
});

