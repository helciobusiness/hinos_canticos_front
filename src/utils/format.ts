export function formatHinoNumero(numero: number): string {
  return numero.toString().padStart(3, '0');
}

export function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return 'Agora mesmo';
  if (minutes < 60) return `Há ${minutes} min`;
  if (hours < 24) return `Há ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  if (days === 1) return 'Ontem';
  if (days < 7) return `Há ${days} dias`;
  
  const d = new Date(timestamp);
  return d.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' });
}
