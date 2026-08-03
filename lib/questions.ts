export interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  category?: string
}

export const QUESTIONS: QuizQuestion[] = [
  // ── GEOGRAFIA ──────────────────────────────────────────────────────────────
  { id: 1, question: "Qual é a capital do Brasil?", options: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"], correctAnswer: 2, category: "Geografia" },
  { id: 2, question: "Qual é o maior país da América do Sul?", options: ["Argentina", "Brasil", "Colômbia", "Peru"], correctAnswer: 1, category: "Geografia" },
  { id: 3, question: "Qual é a capital da Argentina?", options: ["Buenos Aires", "Córdoba", "Rosário", "Mendoza"], correctAnswer: 0, category: "Geografia" },
  { id: 4, question: "Qual é a capital da França?", options: ["Lyon", "Marselha", "Nice", "Paris"], correctAnswer: 3, category: "Geografia" },
  { id: 5, question: "Qual é o maior oceano do mundo?", options: ["Oceano Pacífico", "Oceano Atlântico", "Oceano Índico", "Oceano Ártico"], correctAnswer: 0, category: "Geografia" },
  { id: 6, question: "Qual é o país com maior extensão territorial?", options: ["China", "EUA", "Rússia", "Canadá"], correctAnswer: 2, category: "Geografia" },
  { id: 7, question: "Qual é a capital do Japão?", options: ["Osaka", "Tóquio", "Quioto", "Hiroshima"], correctAnswer: 1, category: "Geografia" },
  { id: 8, question: "Qual é o maior continente do mundo?", options: ["América", "Ásia", "África", "Europa"], correctAnswer: 1, category: "Geografia" },
  { id: 9, question: "Qual é a capital da Alemanha?", options: ["Berlim", "Munique", "Hamburgo", "Frankfurt"], correctAnswer: 0, category: "Geografia" },
  { id: 10, question: "Em que continente fica o Egito?", options: ["Ásia", "África", "Europa", "Oriente Médio"], correctAnswer: 1, category: "Geografia" },
  { id: 11, question: "Qual é a capital da Austrália?", options: ["Sydney", "Melbourne", "Camberra", "Brisbane"], correctAnswer: 2, category: "Geografia" },
  { id: 12, question: "Qual é o menor país do mundo?", options: ["Monaco", "San Marino", "Vaticano", "Liechtenstein"], correctAnswer: 2, category: "Geografia" },
  { id: 13, question: "Qual é a capital do México?", options: ["Guadalajara", "Monterrey", "Tijuana", "Cidade do México"], correctAnswer: 3, category: "Geografia" },
  { id: 14, question: "Quantos países fazem fronteira com o Brasil?", options: ["8", "9", "10", "11"], correctAnswer: 2, category: "Geografia" },
  { id: 15, question: "Qual é o maior lago do mundo?", options: ["Lago Baikal", "Lago Superior", "Mar Cáspio", "Lago Vitória"], correctAnswer: 2, category: "Geografia" },

  // ── CIÊNCIAS ───────────────────────────────────────────────────────────────
  { id: 16, question: "Qual é a fórmula química da água?", options: ["H2O2", "HO", "H2O", "H3O"], correctAnswer: 2, category: "Ciências" },
  { id: 17, question: "Qual é o planeta mais próximo do Sol?", options: ["Vênus", "Mercúrio", "Marte", "Terra"], correctAnswer: 1, category: "Ciências" },
  { id: 18, question: "Qual é o maior planeta do sistema solar?", options: ["Saturno", "Netuno", "Urano", "Júpiter"], correctAnswer: 3, category: "Ciências" },
  { id: 19, question: "Qual metal é líquido à temperatura ambiente?", options: ["Prata", "Ouro", "Mercúrio", "Estanho"], correctAnswer: 2, category: "Ciências" },
  { id: 20, question: "Qual é o principal gás da atmosfera terrestre?", options: ["Oxigênio", "Nitrogênio", "Argônio", "Dióxido de carbono"], correctAnswer: 1, category: "Ciências" },
  { id: 21, question: "Qual é o símbolo químico do ouro?", options: ["Or", "Au", "Go", "Ag"], correctAnswer: 1, category: "Ciências" },
  { id: 22, question: "Qual é o símbolo químico do ferro?", options: ["Fr", "Ir", "Fe", "Fo"], correctAnswer: 2, category: "Ciências" },
  { id: 23, question: "Qual é a velocidade aproximada da luz?", options: ["150.000 km/s", "200.000 km/s", "250.000 km/s", "300.000 km/s"], correctAnswer: 3, category: "Ciências" },
  { id: 24, question: "Qual é o planeta com os maiores anéis?", options: ["Saturno", "Júpiter", "Urano", "Netuno"], correctAnswer: 0, category: "Ciências" },
  { id: 25, question: "Qual é o osso mais longo do corpo humano?", options: ["Úmero", "Tíbia", "Fêmur", "Rádio"], correctAnswer: 2, category: "Ciências" },
  { id: 26, question: "Quantos ossos tem o corpo humano adulto?", options: ["196", "200", "206", "212"], correctAnswer: 2, category: "Ciências" },
  { id: 27, question: "Quantas câmaras tem o coração humano?", options: ["2", "3", "4", "5"], correctAnswer: 2, category: "Ciências" },
  { id: 28, question: "Qual é o maior órgão do corpo humano?", options: ["Fígado", "Pele", "Pulmão", "Intestino"], correctAnswer: 1, category: "Ciências" },
  { id: 29, question: "Qual é o gás mais leve?", options: ["Hélio", "Hidrogênio", "Metano", "Nitrogênio"], correctAnswer: 1, category: "Ciências" },
  { id: 30, question: "Qual gás é o principal responsável pelo efeito estufa?", options: ["Metano", "Dióxido de carbono", "Oxigênio", "Nitrogênio"], correctAnswer: 1, category: "Ciências" },

  // ── HISTÓRIA ───────────────────────────────────────────────────────────────
  { id: 31, question: "Em que ano o Brasil proclamou sua Independência?", options: ["1820", "1822", "1824", "1825"], correctAnswer: 1, category: "História" },
  { id: 32, question: "Quem foi o primeiro presidente do Brasil?", options: ["Getúlio Vargas", "Dom Pedro II", "Deodoro da Fonseca", "Floriano Peixoto"], correctAnswer: 2, category: "História" },
  { id: 33, question: "Em que ano terminou a Segunda Guerra Mundial?", options: ["1943", "1944", "1945", "1946"], correctAnswer: 2, category: "História" },
  { id: 34, question: "Quem pintou a Mona Lisa?", options: ["Michelangelo", "Leonardo da Vinci", "Rafael", "Botticelli"], correctAnswer: 1, category: "História" },
  { id: 35, question: "Em que ano Cristóvão Colombo chegou à América?", options: ["1490", "1491", "1492", "1493"], correctAnswer: 2, category: "História" },
  { id: 36, question: "Quem foi o primeiro homem a pisar na Lua?", options: ["Buzz Aldrin", "Neil Armstrong", "Yuri Gagarin", "John Glenn"], correctAnswer: 1, category: "História" },
  { id: 37, question: "Em que ano o homem chegou à Lua?", options: ["1967", "1968", "1969", "1970"], correctAnswer: 2, category: "História" },
  { id: 38, question: "Quem inventou o telefone?", options: ["Thomas Edison", "Graham Bell", "Nikola Tesla", "James Watt"], correctAnswer: 1, category: "História" },
  { id: 39, question: "Quem inventou a lâmpada elétrica?", options: ["Graham Bell", "Nikola Tesla", "Thomas Edison", "Albert Einstein"], correctAnswer: 2, category: "História" },
  { id: 40, question: "Quem formulou a teoria da evolução?", options: ["Isaac Newton", "Charles Darwin", "Gregor Mendel", "Louis Pasteur"], correctAnswer: 1, category: "História" },
  { id: 41, question: "Em que país nasceu Albert Einstein?", options: ["Áustria", "Alemanha", "Suíça", "Estados Unidos"], correctAnswer: 1, category: "História" },
  { id: 42, question: "Quem pintou a Capela Sistina?", options: ["Leonardo da Vinci", "Michelangelo", "Rafael", "Botticelli"], correctAnswer: 1, category: "História" },
  { id: 43, question: "Em que ano foi a Revolução Francesa?", options: ["1776", "1789", "1799", "1804"], correctAnswer: 1, category: "História" },
  { id: 44, question: "Em que ano foi abolida a escravidão no Brasil?", options: ["1881", "1885", "1888", "1891"], correctAnswer: 2, category: "História" },
  { id: 45, question: "Em que ano Pedro Álvares Cabral chegou ao Brasil?", options: ["1498", "1500", "1502", "1505"], correctAnswer: 1, category: "História" },

  // ── MATEMÁTICA ─────────────────────────────────────────────────────────────
  { id: 46, question: "Quantos lados tem um hexágono?", options: ["5", "6", "7", "8"], correctAnswer: 1, category: "Matemática" },
  { id: 47, question: "Quantos graus tem a soma dos ângulos internos de um triângulo?", options: ["90°", "120°", "180°", "360°"], correctAnswer: 2, category: "Matemática" },
  { id: 48, question: "Quantos metros tem um quilômetro?", options: ["100", "500", "1.000", "10.000"], correctAnswer: 2, category: "Matemática" },
  { id: 49, question: "Quantos bits tem um byte?", options: ["4", "8", "16", "32"], correctAnswer: 1, category: "Matemática" },
  { id: 50, question: "Qual é a raiz quadrada de 144?", options: ["10", "11", "12", "13"], correctAnswer: 2, category: "Matemática" },
  { id: 51, question: "Quanto é 2 elevado a 10 (2¹⁰)?", options: ["512", "1.024", "2.048", "256"], correctAnswer: 1, category: "Matemática" },
  { id: 52, question: "Quantos lados tem um pentágono?", options: ["4", "5", "6", "7"], correctAnswer: 1, category: "Matemática" },
  { id: 53, question: "Qual é o valor de Pi (aproximado)?", options: ["3,14", "3,16", "3,18", "3,12"], correctAnswer: 0, category: "Matemática" },
  { id: 54, question: "Quantos minutos tem um dia inteiro?", options: ["1.200", "1.400", "1.440", "1.500"], correctAnswer: 2, category: "Matemática" },
  { id: 55, question: "Qual é o resultado de 15% de 200?", options: ["20", "25", "30", "35"], correctAnswer: 2, category: "Matemática" },

  // ── CULTURA BRASILEIRA ──────────────────────────────────────────────────────
  { id: 56, question: "Qual é o animal símbolo do Brasil?", options: ["Arara-azul", "Onça-pintada", "Tucano", "Boto-rosa"], correctAnswer: 1, category: "Cultura Brasileira" },
  { id: 57, question: "Quem escreveu 'Dom Casmurro'?", options: ["José de Alencar", "Clarice Lispector", "Machado de Assis", "Carlos Drummond"], correctAnswer: 2, category: "Cultura Brasileira" },
  { id: 58, question: "Quem escreveu 'O Guarani'?", options: ["Machado de Assis", "José de Alencar", "Euclides da Cunha", "Lima Barreto"], correctAnswer: 1, category: "Cultura Brasileira" },
  { id: 59, question: "Quantas Copas do Mundo o Brasil ganhou?", options: ["4", "5", "6", "3"], correctAnswer: 1, category: "Cultura Brasileira" },
  { id: 60, question: "Em que ano o Brasil ganhou sua primeira Copa do Mundo?", options: ["1954", "1958", "1962", "1966"], correctAnswer: 1, category: "Cultura Brasileira" },
  { id: 61, question: "Qual é a maior cidade do Brasil por população?", options: ["Rio de Janeiro", "Salvador", "Fortaleza", "São Paulo"], correctAnswer: 3, category: "Cultura Brasileira" },
  { id: 62, question: "Qual é a moeda atual do Brasil?", options: ["Cruzeiro", "Cruzado", "Real", "Escudo"], correctAnswer: 2, category: "Cultura Brasileira" },
  { id: 63, question: "Em que cidade fica o estádio do Maracanã?", options: ["São Paulo", "Belo Horizonte", "Rio de Janeiro", "Brasília"], correctAnswer: 2, category: "Cultura Brasileira" },
  { id: 64, question: "Qual é o maior estado do Brasil em área?", options: ["Minas Gerais", "Mato Grosso", "Pará", "Amazonas"], correctAnswer: 3, category: "Cultura Brasileira" },
  { id: 65, question: "Quantos estados tem o Brasil?", options: ["24", "25", "26", "27"], correctAnswer: 2, category: "Cultura Brasileira" },
  { id: 66, question: "Qual é a árvore símbolo do Brasil?", options: ["Ipê", "Pau-brasil", "Jacarandá", "Cerejeira"], correctAnswer: 1, category: "Cultura Brasileira" },
  { id: 67, question: "Em que ano a família real portuguesa chegou ao Brasil?", options: ["1805", "1808", "1810", "1815"], correctAnswer: 1, category: "Cultura Brasileira" },
  { id: 68, question: "Qual é o maior rio inteiramente brasileiro?", options: ["Rio São Francisco", "Rio Paraná", "Rio Tocantins", "Rio Araguaia"], correctAnswer: 0, category: "Cultura Brasileira" },
  { id: 69, question: "Em que ano o Brasil sediou a Copa do Mundo de futebol?", options: ["2010", "2012", "2014", "2016"], correctAnswer: 2, category: "Cultura Brasileira" },
  { id: 70, question: "Qual é a capital do estado de Minas Gerais?", options: ["Uberlândia", "Contagem", "Belo Horizonte", "Juiz de Fora"], correctAnswer: 2, category: "Cultura Brasileira" },

  // ── CONHECIMENTOS GERAIS ────────────────────────────────────────────────────
  { id: 71, question: "Qual é o maior deserto quente do mundo?", options: ["Gobi", "Saara", "Atacama", "Kalahari"], correctAnswer: 1, category: "Conhecimentos Gerais" },
  { id: 72, question: "Qual é o mineral mais duro da natureza?", options: ["Rubi", "Safira", "Diamante", "Esmeralda"], correctAnswer: 2, category: "Conhecimentos Gerais" },
  { id: 73, question: "Qual é o animal terrestre mais rápido?", options: ["Leão", "Leopardo", "Guepardo", "Cavalo"], correctAnswer: 2, category: "Conhecimentos Gerais" },
  { id: 74, question: "Qual é o maior animal terrestre?", options: ["Rinoceronte", "Elefante africano", "Hipopótamo", "Girafa"], correctAnswer: 1, category: "Conhecimentos Gerais" },
  { id: 75, question: "Quantas asas tem uma abelha?", options: ["2", "4", "6", "8"], correctAnswer: 1, category: "Conhecimentos Gerais" },
  { id: 76, question: "Quantas patas tem uma aranha?", options: ["6", "8", "10", "12"], correctAnswer: 1, category: "Conhecimentos Gerais" },
  { id: 77, question: "Qual é o maior peixe do mundo?", options: ["Tubarão-branco", "Tubarão-baleia", "Tubarão-martelo", "Manta-raia"], correctAnswer: 1, category: "Conhecimentos Gerais" },
  { id: 78, question: "Em que país fica a Torre Eiffel?", options: ["Itália", "Espanha", "França", "Bélgica"], correctAnswer: 2, category: "Conhecimentos Gerais" },
  { id: 79, question: "Em que país fica o Coliseu?", options: ["Grécia", "Itália", "Espanha", "Portugal"], correctAnswer: 1, category: "Conhecimentos Gerais" },
  { id: 80, question: "Em que país fica Machu Picchu?", options: ["Chile", "Peru", "Bolívia", "Colômbia"], correctAnswer: 1, category: "Conhecimentos Gerais" },
  { id: 81, question: "Quantas cores tem o arco-íris?", options: ["5", "6", "7", "8"], correctAnswer: 2, category: "Conhecimentos Gerais" },
  { id: 82, question: "Qual é o maior rio do mundo em volume de água?", options: ["Rio Nilo", "Rio Amazonas", "Rio Mississipi", "Rio Yangtzé"], correctAnswer: 1, category: "Conhecimentos Gerais" },
  { id: 83, question: "Qual é a temperatura de ebulição da água ao nível do mar?", options: ["90°C", "95°C", "100°C", "110°C"], correctAnswer: 2, category: "Conhecimentos Gerais" },
  { id: 84, question: "Quantos dentes tem um adulto (com sisos)?", options: ["28", "30", "32", "34"], correctAnswer: 2, category: "Conhecimentos Gerais" },
  { id: 85, question: "Qual é o número de Avogadro (aprox.)?", options: ["6×10²¹", "6×10²²", "6×10²³", "6×10²⁴"], correctAnswer: 2, category: "Conhecimentos Gerais" },

  // ── TECNOLOGIA ─────────────────────────────────────────────────────────────
  { id: 86, question: "Em que ano foi fundado o Facebook?", options: ["2002", "2003", "2004", "2005"], correctAnswer: 2, category: "Tecnologia" },
  { id: 87, question: "Quem fundou a Apple?", options: ["Bill Gates", "Steve Jobs", "Jeff Bezos", "Mark Zuckerberg"], correctAnswer: 1, category: "Tecnologia" },
  { id: 88, question: "Quem fundou a Microsoft?", options: ["Steve Jobs", "Elon Musk", "Bill Gates", "Larry Page"], correctAnswer: 2, category: "Tecnologia" },
  { id: 89, question: "O que significa a sigla CPU?", options: ["Central Power Unit", "Central Processing Unit", "Computer Processing Unit", "Core Power Unit"], correctAnswer: 1, category: "Tecnologia" },
  { id: 90, question: "O que significa HTML?", options: ["HyperText Markup Language", "High Tech Modern Language", "HyperText Modern Link", "HyperText Machine Language"], correctAnswer: 0, category: "Tecnologia" },
  { id: 91, question: "Em que ano surgiu a internet (ARPANET)?", options: ["1965", "1967", "1969", "1971"], correctAnswer: 2, category: "Tecnologia" },
  { id: 92, question: "O que significa GPS?", options: ["Global Positioning System", "General Position Satellite", "Global Precision System", "Geographic Position Service"], correctAnswer: 0, category: "Tecnologia" },
  { id: 93, question: "Qual linguagem de programação usa a sintaxe 'console.log'?", options: ["Python", "Java", "JavaScript", "C++"], correctAnswer: 2, category: "Tecnologia" },
  { id: 94, question: "O que significa Wi-Fi?", options: ["Wireless Fidelity", "Wide Frequency", "Wireless Fiber", "Wire-Free Internet"], correctAnswer: 0, category: "Tecnologia" },
  { id: 95, question: "Qual é o maior buscador da internet?", options: ["Bing", "Yahoo", "Google", "DuckDuckGo"], correctAnswer: 2, category: "Tecnologia" },

  // ── ARTE E MÚSICA ───────────────────────────────────────────────────────────
  { id: 96, question: "Quem pintou 'A Noite Estrelada'?", options: ["Pablo Picasso", "Vincent van Gogh", "Claude Monet", "Salvador Dalí"], correctAnswer: 1, category: "Arte e Música" },
  { id: 97, question: "Quem compôs a Nona Sinfonia?", options: ["Mozart", "Bach", "Beethoven", "Chopin"], correctAnswer: 2, category: "Arte e Música" },
  { id: 98, question: "Quem escreveu 'Romeu e Julieta'?", options: ["Charles Dickens", "Victor Hugo", "William Shakespeare", "Oscar Wilde"], correctAnswer: 2, category: "Arte e Música" },
  { id: 99, question: "Quantas cordas tem um violão comum?", options: ["4", "5", "6", "7"], correctAnswer: 2, category: "Arte e Música" },
  { id: 100, question: "Quem compôs 'Para Elisa'?", options: ["Mozart", "Bach", "Beethoven", "Schubert"], correctAnswer: 2, category: "Arte e Música" },
]

export function shuffleQuestions(questions: QuizQuestion[]): QuizQuestion[] {
  const arr = [...questions]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
