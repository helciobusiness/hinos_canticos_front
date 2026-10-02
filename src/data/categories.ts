export interface IHymnCategory {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  faixaNumeros: { min: number; max: number };
  hinosExemplo: number[];
}

export const CATEGORIAS_HINOS: IHymnCategory[] = [
  {
    id: 'louvor-adoracao',
    nome: 'Louvor e Adoração',
    descricao: 'Hinos de exaltação, majestade e glória a Deus',
    icone: 'Crown',
    faixaNumeros: { min: 1, max: 70 },
    hinosExemplo: [1, 5, 12, 23, 45, 60],
  },
  {
    id: 'jesus-cristo',
    nome: 'Jesus Cristo e a Cruz',
    descricao: 'A redenção, o sacrifício e o amor do Salvador',
    icone: 'Cross',
    faixaNumeros: { min: 71, max: 180 },
    hinosExemplo: [75, 88, 102, 120, 145, 172],
  },
  {
    id: 'salvacao-graca',
    nome: 'Salvação e Graça',
    descricao: 'O convite divino, perdão e reconciliação com Deus',
    icone: 'HeartHandshake',
    faixaNumeros: { min: 181, max: 280 },
    hinosExemplo: [185, 204, 219, 240, 265, 278],
  },
  {
    id: 'vida-crista',
    nome: 'Vida Cristã e Fé',
    descricao: 'Caminhada, fidelidade, confiança e santificação',
    icone: 'Footprints',
    faixaNumeros: { min: 281, max: 380 },
    hinosExemplo: [290, 310, 335, 350, 370, 379],
  },
  {
    id: 'oracao-comunhao',
    nome: 'Oração e Comunhão',
    descricao: 'Súplica, intercessão e presença do Espírito Santo',
    icone: 'Flame',
    faixaNumeros: { min: 381, max: 460 },
    hinosExemplo: [385, 402, 420, 435, 450],
  },
  {
    id: 'ceia-senhor',
    nome: 'Ceia do Senhor',
    descricao: 'Memorial do corpo e sangue de Cristo na congregação',
    icone: 'Wine',
    faixaNumeros: { min: 461, max: 510 },
    hinosExemplo: [465, 475, 488, 495, 505],
  },
  {
    id: 'esperanca-gloria',
    nome: 'Esperança e Glória',
    descricao: 'A segunda vinda, a pátria celeste e a eternidade',
    icone: 'Sun',
    faixaNumeros: { min: 511, max: 581 },
    hinosExemplo: [515, 530, 545, 560, 575, 581],
  },
];
