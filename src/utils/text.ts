export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function toDiacriticPattern(str: string): string {
  const map: Record<string, string> = {
    a: '[aáàãâä]',
    e: '[eéèêë]',
    i: '[iíìîï]',
    o: '[oóòõôö]',
    u: '[uúùûü]',
    c: '[cç]',
  };
  return normalizeText(str)
    .split('')
    .map((ch) => map[ch] || ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('');
}

/**
 * Destaca os termos de busca no texto retornando segmentos com marcação
 */
export function highlightMatch(text: string, query: string): Array<{ text: string; match: boolean }> {
  if (!text || !query || !query.trim()) {
    return [{ text, match: false }];
  }

  const words = query.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [{ text, match: false }];

  const pattern = words.map(toDiacriticPattern).join('|');
  const regex = new RegExp(`(${pattern})`, 'gi');

  const rawParts = text.split(regex);
  return rawParts
    .filter((p) => p.length > 0)
    .map((part) => {
      const isMatch = words.some((w) => normalizeText(part) === normalizeText(w));
      return { text: part, match: isMatch };
    });
}
