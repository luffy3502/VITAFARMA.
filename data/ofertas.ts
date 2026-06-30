export type Oferta = {
  id: number;
  nome: string;
  categoria: string;
  descricao: string;
  imagem: string;
  precoAntigo: string;
  precoAtual: string;
  selo: "Oferta" | "Mais Vendido" | "Novo";
  mensagemWhatsApp: string;
};

export const ofertasSemana: Oferta[] = [
  {
    id: 1,
    nome: "Vitamina C 1g",
    categoria: "Vitaminas",
    descricao: "Suporte diário para imunidade, energia e bem-estar.",
    imagem:
      "https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&w=900&q=82",
    precoAntigo: "R$ 39,90",
    precoAtual: "R$ 29,90",
    selo: "Oferta",
    mensagemWhatsApp:
      "Olá, VitaFarma!\n\nTenho interesse no produto:\n\nVitamina C 1g\n\nAinda está disponível?",
  },
  {
    id: 2,
    nome: "Protetor Solar FPS 60",
    categoria: "Dermocosméticos",
    descricao: "Proteção alta com toque seco para a rotina de cuidados.",
    imagem:
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=900&q=82",
    precoAntigo: "R$ 79,90",
    precoAtual: "R$ 59,90",
    selo: "Mais Vendido",
    mensagemWhatsApp:
      "Olá, VitaFarma!\n\nTenho interesse no produto:\n\nProtetor Solar FPS 60\n\nAinda está disponível?",
  },
  {
    id: 3,
    nome: "Kit Higiene Essencial",
    categoria: "Higiene",
    descricao: "Itens selecionados para autocuidado e proteção diária.",
    imagem:
      "https://images.unsplash.com/photo-1583947581924-860bda6a26df?auto=format&fit=crop&w=900&q=82",
    precoAntigo: "R$ 49,90",
    precoAtual: "R$ 34,90",
    selo: "Novo",
    mensagemWhatsApp:
      "Olá, VitaFarma!\n\nTenho interesse no produto:\n\nKit Higiene Essencial\n\nAinda está disponível?",
  },
];
