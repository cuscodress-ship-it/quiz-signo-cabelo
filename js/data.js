/**
 * Conteúdo da experiência: perguntas do quiz, matriz de pontuação
 * e o banco completo dos 12 signos capilares.
 */

// Ordem fixa usada apenas para desempate determinístico (não é ranking de "melhor signo").
const SIGN_TIEBREAK_ORDER = [
  "leao", "escorpiao", "sagitario", "virgem", "aries", "capricornio",
  "touro", "libra", "peixes", "cancer", "gemeos", "aquario",
];

const ZODIAC_SIGNS = {
  aries: {
    id: "aries",
    symbol: "♈︎",
    name: "Áries",
    description:
      "Seu cabelo vive no acelerador. Gosta de ação, de mudar de visual do nada e não tem paciência pra ficar parado no espelho.",
    positives: ["Cheio de energia e movimento", "Adora um corte ou mudança nova", "Nunca é sem graça"],
    challenges: ["Ressecamento por excesso de calor e pressa", "Pouca paciência para rotina de cuidados"],
  },
  touro: {
    id: "touro",
    symbol: "♉︎",
    name: "Touro",
    description:
      "Seu cabelo gosta de estabilidade. Forte, resistente e fiel à mesma rotina — não é ele que vai topar mudança radical de uma hora pra outra.",
    positives: ["Fios fortes e resistentes", "Se dá bem com rotina consistente", "Aguenta tranquilo o dia a dia"],
    challenges: ["Tende a pesar ou oleosidade na raiz", "Resiste (até demais) a trocar de produto"],
  },
  gemeos: {
    id: "gemeos",
    symbol: "♊︎",
    name: "Gêmeos",
    description:
      "Seu cabelo muda de humor tanto quanto você. Hoje é liso, amanhã quer volume — imprevisível e sempre com algo novo pra mostrar.",
    positives: ["Versátil, combina com qualquer estilo", "Nunca enjoa de um penteado só", "Se adapta rápido"],
    challenges: ["Frizz por causa da variação de rotina", "Comportamento imprevisível de um dia pro outro"],
  },
  cancer: {
    id: "cancer",
    symbol: "♋︎",
    name: "Câncer",
    description:
      "Seu cabelo é sensível e sente tudo — clima, água, produto novo. Precisa de carinho e de proteção pra se sentir em casa.",
    positives: ["Reage bem a cuidado e carinho extra", "Cresce fiel quando bem tratado", "Combina com rituais de autocuidado"],
    challenges: ["Ressecamento fácil com mudanças bruscas", "Sensível a trocas repentinas de produto"],
  },
  leao: {
    id: "leao",
    symbol: "♌︎",
    name: "Leão",
    description:
      "Seu cabelo gosta de chamar atenção. Tem brilho, presença e personalidade. Mas também sente bastante os efeitos do calor, vento e ressecamento.",
    positives: ["Presença marcante, sempre nota-se", "Brilho natural quando bem cuidado", "Combina com qualquer entrada em cena"],
    challenges: ["Sofre com calor do secador/chapinha", "Ressecamento por exposição ao vento e sol"],
  },
  virgem: {
    id: "virgem",
    symbol: "♍︎",
    name: "Virgem",
    description:
      "Seu cabelo é detalhista como você. Gosta de rotina organizada, produto certo, cuidado impecável — nada de deixar ao acaso.",
    positives: ["Rotina de cuidado bem organizada", "Fios disciplinados e cheios de cuidado", "Detalhista com cada etapa"],
    challenges: ["Perfeccionismo pode virar excesso de produto", "Se cobra demais quando algo sai do controle"],
  },
  libra: {
    id: "libra",
    symbol: "♎︎",
    name: "Libra",
    description:
      "Seu cabelo busca equilíbrio: nem muito, nem pouco. Gosta de elegância, de harmonia visual e de ficar sempre no ponto certo.",
    positives: ["Equilíbrio entre estilo e saúde", "Elegante em qualquer ocasião", "Fácil de adaptar ao dia"],
    challenges: ["Indecisão entre cuidar mais ou menos", "Rotina que muda de intensidade com frequência"],
  },
  escorpiao: {
    id: "escorpiao",
    symbol: "♏︎",
    name: "Escorpião",
    description:
      "Seu cabelo é intenso e não tem medo de transformação — corte novo, cor nova, tudo bem-vindo. Só não perdoa quando exagera na química.",
    positives: ["Marcante, com personalidade forte", "Não tem medo de se reinventar", "Fios com bastante presença"],
    challenges: ["Mais propenso a quebra por excesso de química/calor", "Intensidade pede cuidado redobrado"],
  },
  sagitario: {
    id: "sagitario",
    symbol: "♐︎",
    name: "Sagitário",
    description:
      "Seu cabelo vive ao ar livre. Livre, despojado, sempre pronto pra próxima aventura — sol, vento e praia fazem parte do pacote.",
    positives: ["Espírito livre, estilo despojado", "Combina com vida ao ar livre", "Não se abala fácil"],
    challenges: ["Maior exposição solar pede mais proteção", "Ressecamento pelo estilo de vida agitado"],
  },
  capricornio: {
    id: "capricornio",
    symbol: "♑︎",
    name: "Capricórnio",
    description:
      "Seu cabelo é disciplinado e pensa a longo prazo. Gosta de rotina eficiente e de resultado — sem frescura, sem enrolação.",
    positives: ["Rotina eficiente e consistente", "Foco em resultado de longo prazo", "Não se abala com o dia a dia corrido"],
    challenges: ["Pode negligenciar brilho e hidratação pela praticidade", "Prioriza o funcional antes do prazer do cuidado"],
  },
  aquario: {
    id: "aquario",
    symbol: "♒︎",
    name: "Aquário",
    description:
      "Seu cabelo gosta de ser único. Sai da caixinha, testa tendência, tem estilo autêntico que ninguém mais tem igual.",
    positives: ["Estilo autêntico e original", "Não tem medo de fugir do óbvio", "Sempre um passo à frente das tendências"],
    challenges: ["Testar muita tendência pode desequilibrar a fibra", "Precisa de reforço pra manter a estrutura dos fios"],
  },
  peixes: {
    id: "peixes",
    symbol: "♓︎",
    name: "Peixes",
    description:
      "Seu cabelo é sonhador e fluido, sensível a tudo ao redor — umidade, água, clima. Vive em sintonia com o ambiente.",
    positives: ["Fluido, fácil de moldar", "Sensível e em sintonia com o ambiente", "Charme natural, nada forçado"],
    challenges: ["Frizz e falta de definição em dias úmidos", "Sensibilidade alta à água e ao clima"],
  },
};

const QUIZ_QUESTIONS = [
  {
    id: "rotina",
    question: "Qual é sua rotina?",
    options: [
      { label: "Academia", weights: { aries: 2, escorpiao: 1 } },
      { label: "Trabalho", weights: { capricornio: 2, virgem: 1 } },
      { label: "Praia", weights: { sagitario: 2, peixes: 1 } },
      { label: "Piscina", weights: { peixes: 2, cancer: 1 } },
      { label: "Home Office", weights: { virgem: 2, touro: 1 } },
      { label: "Muito ao ar livre", weights: { sagitario: 2, aries: 1 } },
    ],
  },
  {
    id: "desafio",
    question: "Seu maior desafio é:",
    options: [
      { label: "Frizz", weights: { peixes: 2, gemeos: 1 } },
      { label: "Ressecamento", weights: { cancer: 2, sagitario: 1 } },
      { label: "Quebra", weights: { escorpiao: 2, aries: 1 } },
      { label: "Oleosidade", weights: { touro: 2, capricornio: 1 } },
      { label: "Volume", weights: { aquario: 2, leao: 1 } },
      { label: "Falta de brilho", weights: { virgem: 2, libra: 1 } },
    ],
  },
  {
    id: "secador",
    question: "Com que frequência usa secador?",
    options: [
      { label: "Todos os dias", weights: { leao: 2, aries: 1 } },
      { label: "Algumas vezes", weights: { libra: 2, gemeos: 1 } },
      { label: "Quase nunca", weights: { touro: 2, capricornio: 1 } },
      { label: "Nunca", weights: { peixes: 2, virgem: 1 } },
    ],
  },
  {
    id: "quando_cuida",
    question: "Quando você costuma cuidar do cabelo?",
    options: [
      { label: "Antes de sair", weights: { leao: 2, libra: 1 } },
      { label: "Depois que volto", weights: { cancer: 2, peixes: 1 } },
      { label: "Antes de dormir", weights: { escorpiao: 2, virgem: 1 } },
      { label: "Depois da academia", weights: { aries: 2, sagitario: 1 } },
      { label: "Não cuido", weights: { sagitario: 2, aquario: 1 } },
    ],
  },
  {
    id: "tipo_cabelo",
    question: "Seu cabelo é mais:",
    options: [
      { label: "Cacheado", weights: { leao: 2, aquario: 1 } },
      { label: "Ondulado", weights: { libra: 2, peixes: 1 } },
      { label: "Liso", weights: { virgem: 2, capricornio: 1 } },
      { label: "Crespo", weights: { escorpiao: 2, aries: 1 } },
    ],
  },
  {
    id: "exposicao_sol",
    question: "Quanto tempo você fica exposta ao sol?",
    options: [
      { label: "Muito", weights: { sagitario: 2, aries: 1 } },
      { label: "Às vezes", weights: { gemeos: 2, libra: 1 } },
      { label: "Pouco", weights: { cancer: 2, virgem: 1 } },
      { label: "Nunca", weights: { capricornio: 2, touro: 1 } },
    ],
  },
];

/**
 * Recebe um objeto { questionId: optionIndex, ... } e retorna o id do signo vencedor.
 */
function computeZodiacSign(answers) {
  const scores = {};
  Object.keys(ZODIAC_SIGNS).forEach((id) => (scores[id] = 0));

  QUIZ_QUESTIONS.forEach((q) => {
    const chosenIndex = answers[q.id];
    if (chosenIndex === undefined) return;
    const option = q.options[chosenIndex];
    if (!option) return;
    Object.entries(option.weights).forEach(([signId, weight]) => {
      scores[signId] += weight;
    });
  });

  let winner = SIGN_TIEBREAK_ORDER[SIGN_TIEBREAK_ORDER.length - 1];
  let bestScore = -Infinity;
  SIGN_TIEBREAK_ORDER.forEach((signId) => {
    if (scores[signId] > bestScore) {
      bestScore = scores[signId];
      winner = signId;
    }
  });

  return winner;
}
