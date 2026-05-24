import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  AlertTriangle,
  Archive,
  ArrowDownToLine,
  BarChart3,
  Bot,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Copy,
  Download,
  FileBarChart,
  FilePlus2,
  Filter,
  Gauge,
  GraduationCap,
  Headphones,
  History,
  KeyRound,
  LayoutDashboard,
  LineChart,
  Link as LinkIcon,
  ListChecks,
  Lock,
  LogOut,
  Mail,
  MessageCircle,
  Mic,
  MoreHorizontal,
  PauseCircle,
  Play,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  StopCircle,
  Target,
  UserCheck,
  Users,
  Wifi,
  XCircle
} from 'lucide-react';
import './styles.css';

if (typeof window !== 'undefined') {
  const demoParams = new URLSearchParams(window.location.search);
  if (demoParams.has('resetDemo')) {
    ['pex-session', 'pex-scenarios', 'pex-accesses', 'pex-results'].forEach((key) => localStorage.removeItem(key));
  }
  if (demoParams.get('demoRole') === 'organizer') {
    localStorage.setItem(
      'pex-session',
      JSON.stringify({ role: 'organizer', name: 'Ana Carolina', email: 'instrutora@pex.com', avatar: 'AC' })
    );
  }
  if (demoParams.get('demoRole') === 'operator') {
    localStorage.setItem(
      'pex-session',
      JSON.stringify({
        role: 'operator',
        name: 'Joana Oliveira',
        email: 'joana.oliveira@aluno.com',
        avatar: 'JO',
        accessId: 'acc-001'
      })
    );
  }
}

const criteriaTemplate = [
  { key: 'opening', label: 'Abertura correta do atendimento', max: 5 },
  { key: 'cordiality', label: 'Cordialidade e tom adequado', max: 10 },
  { key: 'activeListening', label: 'Escuta ativa', max: 10 },
  { key: 'clarity', label: 'Clareza na comunicação', max: 10 },
  { key: 'empathy', label: 'Empatia com o cliente', max: 10 },
  { key: 'knowledge', label: 'Conhecimento técnico ou financeiro', max: 10 },
  { key: 'resolution', label: 'Resolução do problema', max: 15 },
  { key: 'objection', label: 'Argumentação e contorno do não', max: 10 },
  { key: 'upsell', label: 'Oferta de produto adicional', max: 5 },
  { key: 'confirmation', label: 'Confirmação de entendimento', max: 5 },
  { key: 'closing', label: 'Encerramento correto da chamada', max: 5 },
  { key: 'tma', label: 'Tempo médio de atendimento adequado', max: 5 }
];

const stages = ['Abertura', 'Identificação', 'Argumentação', 'Resolução', 'Oferta adicional', 'Encerramento'];

const initialScenarios = [
  {
    id: 'sce-technical',
    name: 'Problema técnico no equipamento',
    type: 'Suporte técnico',
    difficulty: 'Médio',
    mood: 'Irritado',
    customer: 'Marcos Almeida',
    objective: 'Orientar testes básicos, estabilizar o cliente e resolver a falha de energia/cabos.',
    summary: 'Cliente precisa trabalhar e afirma que o equipamento não liga desde cedo.',
    history: 'Já ligou há duas semanas por instabilidade e recebeu troca preventiva de cabo.',
    required: ['Empatia', 'Conhecimento técnico', 'Confirmação de entendimento', 'Encerramento correto']
  },
  {
    id: 'sce-financial',
    name: 'Cobrança indevida',
    type: 'Financeiro',
    difficulty: 'Difícil',
    mood: 'Insatisfeito',
    customer: 'Renata Costa',
    objective: 'Ouvir a reclamação, explicar o lançamento e propor regularização sem linguagem negativa.',
    summary: 'Cliente contesta uma cobrança duplicada na fatura atual.',
    history: 'Pagamento anterior compensado com atraso bancário e protocolo aberto sem retorno.',
    required: ['Escuta ativa', 'Clareza', 'Resolução financeira', 'Tom cordial']
  },
  {
    id: 'sce-offer',
    name: 'Oferta adicional após solução',
    type: 'Comercial',
    difficulty: 'Fácil',
    mood: 'Calmo',
    customer: 'Paulo Nunes',
    objective: 'Resolver segunda via e oferecer produto adicional de forma consultiva.',
    summary: 'Cliente quer segunda via de boleto e demonstra abertura para melhorar o pacote.',
    history: 'Cliente com bom histórico de pagamento e plano antigo sem benefícios atuais.',
    required: ['Resolução rápida', 'Oferta adicional', 'Argumentação', 'Personalização']
  },
  {
    id: 'sce-objection',
    name: 'Contorno do não',
    type: 'Vendas e retenção',
    difficulty: 'Médio',
    mood: 'Indeciso',
    customer: 'Camila Rocha',
    objective: 'Entender objeção, apresentar benefício relevante e respeitar a decisão do cliente.',
    summary: 'Cliente rejeita uma oferta de upgrade por achar o preço alto.',
    history: 'Usa o serviço todos os dias, mas comparou preços com concorrentes.',
    required: ['Contorno do não', 'Linguagem positiva', 'Benefício relevante', 'Cordialidade']
  },
  {
    id: 'sce-dissatisfied',
    name: 'Cliente insatisfeito com atendimento anterior',
    type: 'Relacionamento',
    difficulty: 'Difícil',
    mood: 'Irritado',
    customer: 'Sofia Martins',
    objective: 'Reconhecer a experiência ruim, pedir desculpas e construir uma solução objetiva.',
    summary: 'Cliente relata que ficou sem retorno depois de uma promessa feita no atendimento anterior.',
    history: 'Dois protocolos abertos, uma visita técnica reagendada e reclamação em canal externo.',
    required: ['Empatia', 'Personalização', 'Solução objetiva', 'Escuta ativa']
  }
];

const initialAccesses = [
  {
    id: 'acc-001',
    token: 'PEX-TEC-2048',
    link: 'https://pex.local/s/PEX-TEC-2048',
    scenarioId: 'sce-technical',
    organizerEmail: 'instrutora@pex.com',
    simulationName: 'Turma A - Suporte técnico',
    group: 'Turma A',
    operatorName: 'Aguardando aluno',
    operatorEmail: '',
    status: 'pendente',
    createdAt: '2026-05-20T10:40:00',
    usedAt: '',
    expiresAt: '2026-06-04T23:59:00',
    score: null
  },
  {
    id: 'acc-002',
    token: 'PEX-FIN-1930',
    link: 'https://pex.local/s/PEX-FIN-1930',
    scenarioId: 'sce-financial',
    organizerEmail: 'instrutora@pex.com',
    simulationName: 'Recuperacao financeira',
    group: 'Turma B',
    operatorName: 'Bruno Santos',
    operatorEmail: 'bruno.santos@aluno.com',
    status: 'concluida',
    createdAt: '2026-05-19T14:20:00',
    usedAt: '2026-05-21T09:17:00',
    expiresAt: '2026-06-02T23:59:00',
    score: 83,
    resultId: 'res-001'
  },
  {
    id: 'acc-003',
    token: 'PEX-OFR-4431',
    link: 'https://pex.local/s/PEX-OFR-4431',
    scenarioId: 'sce-offer',
    organizerEmail: 'instrutora@pex.com',
    simulationName: 'Oferta consultiva',
    group: 'Turma A',
    operatorName: 'Lia Menezes',
    operatorEmail: 'lia.menezes@aluno.com',
    status: 'concluida',
    createdAt: '2026-05-18T08:32:00',
    usedAt: '2026-05-22T16:03:00',
    expiresAt: '2026-06-03T23:59:00',
    score: 91,
    resultId: 'res-002'
  },
  {
    id: 'acc-004',
    token: 'PEX-RET-7106',
    link: 'https://pex.local/s/PEX-RET-7106',
    scenarioId: 'sce-objection',
    organizerEmail: 'instrutora@pex.com',
    simulationName: 'Retencao e contorno',
    group: 'Turma C',
    operatorName: 'Aguardando aluno',
    operatorEmail: '',
    status: 'pausada',
    createdAt: '2026-05-22T11:55:00',
    usedAt: '',
    expiresAt: '2026-05-30T23:59:00',
    score: null
  },
  {
    id: 'acc-005',
    token: 'PEX-REL-0061',
    link: 'https://pex.local/s/PEX-REL-0061',
    scenarioId: 'sce-dissatisfied',
    organizerEmail: 'instrutora@pex.com',
    simulationName: 'Experiencia negativa',
    group: 'Turma B',
    operatorName: 'Marta Lima',
    operatorEmail: 'marta.lima@aluno.com',
    status: 'expirada',
    createdAt: '2026-05-10T09:00:00',
    usedAt: '',
    expiresAt: '2026-05-18T23:59:00',
    score: null
  }
];

const baseMessages = {
  'sce-technical': [
    {
      author: 'Cliente',
      role: 'customer',
      text: 'Olha, eu estou sem conseguir trabalhar porque esse equipamento simplesmente nao liga. Ja testei apertar o botao varias vezes.',
      time: '00:05'
    },
    {
      author: 'Operador',
      role: 'agent',
      text: 'Entendo a urgencia, Marcos. Vou ajudar com alguns testes rapidos e acompanhar voce ate termos uma resposta clara.',
      time: '00:23'
    },
    {
      author: 'Cliente',
      role: 'customer',
      text: 'Tudo bem, mas eu preciso resolver logo. Tenho reuniao daqui a pouco.',
      time: '00:34'
    }
  ],
  'sce-financial': [
    {
      author: 'Cliente',
      role: 'customer',
      text: 'Minha fatura veio com uma cobranca duplicada. Eu ja paguei e ninguem me responde.',
      time: '00:04'
    },
    {
      author: 'Operador',
      role: 'agent',
      text: 'Renata, vou verificar com atencao. Sinto muito pela falta de retorno e vou explicar o que aparece no sistema.',
      time: '00:26'
    },
    {
      author: 'Cliente',
      role: 'customer',
      text: 'Espero mesmo, porque nao quero pagar por um erro que nao foi meu.',
      time: '00:39'
    }
  ],
  'sce-offer': [
    {
      author: 'Cliente',
      role: 'customer',
      text: 'Preciso da segunda via do boleto. Se puder mandar rapido, ja ajuda bastante.',
      time: '00:04'
    },
    {
      author: 'Operador',
      role: 'agent',
      text: 'Claro, Paulo. Vou localizar sua fatura e ja envio a segunda via no canal cadastrado.',
      time: '00:19'
    },
    {
      author: 'Cliente',
      role: 'customer',
      text: 'Perfeito. Aproveita e ve se meu plano ainda esta valendo a pena.',
      time: '00:33'
    }
  ],
  'sce-objection': [
    {
      author: 'Cliente',
      role: 'customer',
      text: 'Eu nao quero upgrade. Parece bom, mas esta caro e eu nao quero aumentar minha mensalidade.',
      time: '00:05'
    },
    {
      author: 'Operador',
      role: 'agent',
      text: 'Entendo sua preocupacao com o valor, Camila. Posso entender melhor o que voce usa mais para comparar com algo que faca sentido?',
      time: '00:25'
    },
    {
      author: 'Cliente',
      role: 'customer',
      text: 'Uso bastante, mas nao quero pagar por coisa que nao vou aproveitar.',
      time: '00:38'
    }
  ],
  'sce-dissatisfied': [
    {
      author: 'Cliente',
      role: 'customer',
      text: 'Eu ja falei com duas pessoas e ninguem resolveu. Sinceramente, estou cansada desse atendimento.',
      time: '00:05'
    },
    {
      author: 'Operador',
      role: 'agent',
      text: 'Sofia, peco desculpas pela experiencia anterior. Vou assumir esse atendimento e te dar um caminho objetivo agora.',
      time: '00:24'
    },
    {
      author: 'Cliente',
      role: 'customer',
      text: 'Tomara, porque eu nao quero repetir tudo de novo.',
      time: '00:36'
    }
  ]
};

const initialResults = [
  {
    id: 'res-001',
    accessId: 'acc-002',
    operatorName: 'Bruno Santos',
    operatorEmail: 'bruno.santos@aluno.com',
    scenarioId: 'sce-financial',
    scenarioName: 'Cobrança indevida',
    token: 'PEX-FIN-1930',
    organizerEmail: 'instrutora@pex.com',
    date: '2026-05-21T09:17:00',
    totalTime: '12min 44s',
    totalScore: 83,
    scores: {
      opening: 5,
      cordiality: 8,
      activeListening: 8,
      clarity: 9,
      empathy: 8,
      knowledge: 8,
      resolution: 13,
      objection: 7,
      upsell: 3,
      confirmation: 4,
      closing: 5,
      tma: 5
    },
    strengths: ['Explicou a fatura com clareza', 'Manteve tom calmo', 'Propôs solução financeira objetiva'],
    improvements: ['Confirmar entendimento antes do encerramento', 'Criar uma oferta adicional mais natural'],
    feedback:
      'Voce demonstrou boa cordialidade e conseguiu identificar a causa da cobranca. Na proxima simulacao, confirme melhor o entendimento do cliente e apresente uma oferta adicional quando a situacao estiver estabilizada.',
    transcript: baseMessages['sce-financial']
  },
  {
    id: 'res-002',
    accessId: 'acc-003',
    operatorName: 'Lia Menezes',
    operatorEmail: 'lia.menezes@aluno.com',
    scenarioId: 'sce-offer',
    scenarioName: 'Oferta adicional após solução',
    token: 'PEX-OFR-4431',
    organizerEmail: 'instrutora@pex.com',
    date: '2026-05-22T16:03:00',
    totalTime: '08min 11s',
    totalScore: 91,
    scores: {
      opening: 5,
      cordiality: 10,
      activeListening: 9,
      clarity: 9,
      empathy: 9,
      knowledge: 8,
      resolution: 15,
      objection: 8,
      upsell: 5,
      confirmation: 5,
      closing: 5,
      tma: 3
    },
    strengths: ['Oferta adicional consultiva', 'Boa personalizacao', 'Encerramento seguro'],
    improvements: ['Reduzir etapas repetidas para melhorar TMA'],
    feedback:
      'Atendimento consistente, com solucao rapida e oferta bem posicionada. O principal ajuste e tornar a coleta de dados mais objetiva para reduzir o tempo total.',
    transcript: baseMessages['sce-offer']
  }
];

const students = [
  {
    id: 'stu-001',
    name: 'Lia Menezes',
    email: 'lia.menezes@aluno.com',
    group: 'Turma A',
    score: 91,
    trend: '+8',
    simulations: 4,
    status: 'Ativa'
  },
  {
    id: 'stu-002',
    name: 'Bruno Santos',
    email: 'bruno.santos@aluno.com',
    group: 'Turma B',
    score: 83,
    trend: '+5',
    simulations: 3,
    status: 'Ativo'
  },
  {
    id: 'stu-003',
    name: 'Marta Lima',
    email: 'marta.lima@aluno.com',
    group: 'Turma B',
    score: 68,
    trend: '-3',
    simulations: 2,
    status: 'Reforço'
  },
  {
    id: 'stu-004',
    name: 'Joao Pedro',
    email: 'joao.pedro@aluno.com',
    group: 'Turma C',
    score: 76,
    trend: '+2',
    simulations: 2,
    status: 'Ativo'
  }
];

const navOrganizer = [
  { id: 'dashboard-organizador', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'painel-organizador', label: 'Painel', icon: ShieldCheck },
  { id: 'nova-simulacao', label: 'Nova simulação', icon: FilePlus2 },
  { id: 'gerar-acesso', label: 'Gerar acesso', icon: KeyRound },
  { id: 'acessos', label: 'Acessos', icon: LinkIcon },
  { id: 'resultados', label: 'Resultados', icon: ClipboardCheck },
  { id: 'relatorios', label: 'Relatórios', icon: FileBarChart },
  { id: 'ranking', label: 'Ranking', icon: Star },
  { id: 'historico-conversa', label: 'Conversas', icon: MessageCircle },
  { id: 'cadastro-cenario', label: 'Cenários', icon: Target },
  { id: 'alunos', label: 'Alunos', icon: Users },
  { id: 'perfil-aluno', label: 'Perfil aluno', icon: UserCheck },
  { id: 'voz', label: 'Voz futura', icon: Mic },
  { id: 'configuracoes', label: 'Configurações', icon: Settings }
];

const navOperator = [
  { id: 'dashboard-operador', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'iniciar-simulacao', label: 'Iniciar', icon: Play },
  { id: 'atendimento', label: 'Atendimento', icon: Headphones },
  { id: 'voz', label: 'Voz futura', icon: Mic },
  { id: 'resultado-operador', label: 'Resultado', icon: Gauge },
  { id: 'historico-operador', label: 'Histórico', icon: History },
  { id: 'relatorio-operador', label: 'Relatório', icon: FileBarChart },
  { id: 'configuracoes', label: 'Configurações', icon: Settings }
];

const moodColor = {
  Calmo: 'good',
  Confuso: 'warning',
  Irritado: 'danger',
  Indeciso: 'info',
  Insatisfeito: 'danger'
};

const statusMap = {
  pendente: { label: 'Pendente', tone: 'warning', icon: Clock3 },
  concluida: { label: 'Concluída', tone: 'good', icon: CheckCircle2 },
  expirada: { label: 'Expirada', tone: 'muted', icon: AlertTriangle },
  pausada: { label: 'Pausada', tone: 'info', icon: PauseCircle },
  cancelada: { label: 'Cancelada', tone: 'danger', icon: XCircle },
  ativa: { label: 'Ativa', tone: 'good', icon: CheckCircle2 }
};

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

function formatDate(dateLike) {
  if (!dateLike) return '-';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateLike));
}

function scoreClass(score) {
  if (score >= 90) return 'Excelente';
  if (score >= 75) return 'Bom desempenho';
  if (score >= 60) return 'Regular, precisa melhorar';
  return 'Necessita reforço';
}

function scoreTone(score) {
  if (score >= 90) return 'good';
  if (score >= 75) return 'info';
  if (score >= 60) return 'warning';
  return 'danger';
}

function createToken(type = 'SIM') {
  return `PEX-${type}-${Math.floor(1000 + Math.random() * 8999)}`;
}

function secondsToClock(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function timeLabel(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}min ${String(seconds).padStart(2, '0')}s`;
}

function scoreConversation(messages, elapsedSeconds, scenario) {
  const text = messages
    .filter((message) => message.role === 'agent')
    .map((message) => message.text.toLowerCase())
    .join(' ');
  const hasAny = (words) => words.some((word) => text.includes(word));
  const score = {
    opening: hasAny(['bom dia', 'boa tarde', 'boa noite', 'meu nome', 'atendimento']) ? 5 : 3,
    cordiality: hasAny(['por favor', 'obrigado', 'claro', 'vou ajudar', 'conte comigo']) ? 10 : 7,
    activeListening: hasAny(['entendo', 'compreendo', 'voce me disse', 'pelo que entendi', 'sua preocupacao']) ? 10 : 6,
    clarity: hasAny(['primeiro', 'agora', 'passo', 'explicar', 'vamos']) ? 10 : 7,
    empathy: hasAny(['sinto muito', 'desculpa', 'imagino', 'urgencia', 'experiencia']) ? 10 : 6,
    knowledge: hasAny(['cabo', 'energia', 'fatura', 'protocolo', 'equipamento', 'sistema', 'boleto', 'plano']) ? 10 : 6,
    resolution: hasAny(['resolver', 'solucao', 'corrigir', 'enviar', 'ajuste', 'regularizar', 'teste']) ? 15 : 9,
    objection: hasAny(['beneficio', 'entender sua objecao', 'comparar', 'alternativa', 'sem compromisso']) ? 10 : 6,
    upsell: hasAny(['oferta', 'produto', 'plano', 'beneficio adicional', 'upgrade']) ? 5 : 2,
    confirmation: hasAny(['ficou claro', 'confirma', 'entendimento', 'posso confirmar', 'faz sentido']) ? 5 : 2,
    closing: hasAny(['encerrar', 'protocolo', 'mais alguma coisa', 'agradeco', 'tenha um bom']) ? 5 : 2,
    tma: elapsedSeconds <= 900 ? 5 : elapsedSeconds <= 1200 ? 3 : 1
  };

  if (scenario?.type === 'Financeiro' && !hasAny(['fatura', 'cobranca', 'pagamento', 'regularizar'])) {
    score.knowledge = Math.max(4, score.knowledge - 2);
  }

  const total = Object.values(score).reduce((sum, item) => sum + item, 0);
  const strengths = [];
  const improvements = [];
  if (score.empathy >= 8) strengths.push('Demonstrou empatia em momentos críticos');
  else improvements.push('Usar frases de acolhimento antes de orientar a solução');
  if (score.resolution >= 12) strengths.push('Conduziu o atendimento para uma solução objetiva');
  else improvements.push('Explicar o próximo passo com mais segurança');
  if (score.activeListening >= 8) strengths.push('Praticou escuta ativa');
  else improvements.push('Reformular o problema do cliente para confirmar entendimento');
  if (score.upsell >= 4) strengths.push('Incluiu oferta adicional no momento adequado');
  else improvements.push('Identificar oportunidade de oferta após resolver a solicitação');
  if (score.closing < 4) improvements.push('Finalizar com protocolo, confirmação e agradecimento');

  return {
    total,
    scores: score,
    strengths: strengths.slice(0, 4),
    improvements: improvements.slice(0, 4),
    feedback:
      total >= 90
        ? 'Atendimento excelente. Voce manteve cordialidade, personalizou a conversa e concluiu com seguranca. Continue equilibrando empatia, objetividade e oferta consultiva.'
        : total >= 75
          ? 'Bom desempenho. Voce conduziu a conversa com clareza e chegou a uma solucao. Para evoluir, fortaleça a confirmação de entendimento e posicione melhor a oferta adicional.'
          : total >= 60
            ? 'Resultado regular. A simulação teve avanço, mas precisa de mais escuta ativa, frases positivas e uma condução mais objetiva para resolução.'
            : 'Necessita reforço. Reforce abertura, empatia, organização dos passos e encerramento correto antes de avançar para cenários mais difíceis.'
  };
}

function customerReply(lastText, scenario, step) {
  const message = lastText.toLowerCase();
  const positive = ['entendo', 'sinto', 'desculpa', 'vou ajudar', 'vamos', 'solucao', 'confirmar', 'claro'].some((word) =>
    message.includes(word)
  );
  const technical = ['cabo', 'energia', 'reiniciar', 'equipamento', 'fatura', 'boleto', 'protocolo', 'plano'].some((word) =>
    message.includes(word)
  );
  const offer = ['oferta', 'produto', 'plano', 'upgrade', 'beneficio'].some((word) => message.includes(word));

  if (step >= 4 && offer) {
    return 'Se fizer sentido para mim e nao for empurrado, posso ouvir a proposta. O que mudaria na pratica?';
  }

  if (positive && technical) {
    if (scenario.type === 'Suporte técnico') {
      return 'Ok, estou olhando os cabos agora. O da energia parecia meio frouxo. Qual teste faco em seguida?';
    }
    if (scenario.type === 'Financeiro') {
      return 'Certo, se voce consegue explicar o valor e corrigir o que estiver errado, eu fico mais tranquila.';
    }
    return 'Assim fica mais facil. Pode continuar, estou acompanhando.';
  }

  if (positive) {
    return 'Agradeco o cuidado. So preciso entender exatamente como isso vai ser resolvido hoje.';
  }

  return 'Mas voce ainda nao me explicou direito. Eu preciso de uma resposta clara, nao so de procedimento.';
}

function App() {
  const [session, setSession] = useLocalStorage('pex-session', null);
  const [scenarios, setScenarios] = useLocalStorage('pex-scenarios', initialScenarios);
  const [accesses, setAccesses] = useLocalStorage('pex-accesses', initialAccesses);
  const [results, setResults] = useLocalStorage('pex-results', initialResults);
  const [activePage, setActivePage] = useState(session?.role === 'operator' ? 'dashboard-operador' : 'dashboard-organizador');
  const [selectedAccessId, setSelectedAccessId] = useState(session?.accessId || 'acc-001');
  const [selectedResultId, setSelectedResultId] = useState(results[0]?.id || '');
  const [selectedStudentId, setSelectedStudentId] = useState('stu-001');

  useEffect(() => {
    if (!session) return;
    if (session.role === 'operator') {
      setActivePage((page) => (navOperator.some((item) => item.id === page) ? page : 'dashboard-operador'));
    } else {
      setActivePage((page) => (navOrganizer.some((item) => item.id === page) ? page : 'dashboard-organizador'));
    }
  }, [session]);

  if (!session) {
    return (
      <LoginScreen
        accesses={accesses}
        scenarios={scenarios}
        onOrganizerLogin={() => {
          setSession({
            role: 'organizer',
            name: 'Ana Carolina',
            email: 'instrutora@pex.com',
            avatar: 'AC'
          });
          setActivePage('dashboard-organizador');
        }}
        onOperatorLogin={(access, name, email) => {
          setSelectedAccessId(access.id);
          setSession({
            role: 'operator',
            name,
            email,
            avatar: initials(name),
            accessId: access.id
          });
          setAccesses((items) =>
            items.map((item) =>
              item.id === access.id
                ? {
                    ...item,
                    operatorName: name,
                    operatorEmail: email,
                    status: item.status === 'pendente' ? 'ativa' : item.status
                  }
                : item
            )
          );
          setActivePage('dashboard-operador');
        }}
      />
    );
  }

  const navItems = session.role === 'operator' ? navOperator : navOrganizer;

  return (
    <div className="app-shell">
      <Sidebar
        session={session}
        navItems={navItems}
        activePage={activePage}
        onNavigate={setActivePage}
        onLogout={() => setSession(null)}
      />
      <main className="main">
        <Topbar
          title={pageTitle(activePage)}
          session={session}
          accesses={accesses}
          results={results}
          onNavigate={setActivePage}
        />
        <div className="content">
          {session.role === 'organizer' ? (
            <OrganizerRouter
              page={activePage}
              setPage={setActivePage}
              session={session}
              scenarios={scenarios}
              setScenarios={setScenarios}
              accesses={accesses}
              setAccesses={setAccesses}
              results={results}
              selectedAccessId={selectedAccessId}
              setSelectedAccessId={setSelectedAccessId}
              selectedResultId={selectedResultId}
              setSelectedResultId={setSelectedResultId}
              selectedStudentId={selectedStudentId}
              setSelectedStudentId={setSelectedStudentId}
            />
          ) : (
            <OperatorRouter
              page={activePage}
              setPage={setActivePage}
              session={session}
              scenarios={scenarios}
              accesses={accesses}
              setAccesses={setAccesses}
              results={results}
              setResults={setResults}
              selectedAccessId={selectedAccessId}
              selectedResultId={selectedResultId}
              setSelectedResultId={setSelectedResultId}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function initials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function pageTitle(page) {
  const all = [...navOrganizer, ...navOperator];
  return all.find((item) => item.id === page)?.label || 'PEX';
}

function LoginScreen({ accesses, scenarios, onOrganizerLogin, onOperatorLogin }) {
  const [token, setToken] = useState('PEX-TEC-2048');
  const [name, setName] = useState('Joana Oliveira');
  const [email, setEmail] = useState('joana.oliveira@aluno.com');
  const access = accesses.find((item) => item.token.toUpperCase() === token.toUpperCase().trim());
  const scenario = scenarios.find((item) => item.id === access?.scenarioId);
  const canEnter = access && ['pendente', 'ativa'].includes(access.status);

  return (
    <div className="login-page">
      <section className="login-panel">
        <div className="brand-block">
          <div className="logo-mark">PX</div>
          <div>
            <p className="eyebrow">PEX</p>
            <h1>Plataforma Inteligente de Simulação e Avaliação de Atendimento</h1>
          </div>
        </div>

        <div className="login-grid">
          <div className="login-card">
            <div className="card-heading">
              <div className="icon-tile"><ShieldCheck size={20} /></div>
              <div>
                <h2>Organizador / Instrutor</h2>
                <p>Conta Google vinculada a turmas, acessos e resultados.</p>
              </div>
            </div>
            <button className="google-button" onClick={onOrganizerLogin}>
              <span className="google-g">G</span>
              Entrar com Google
            </button>
            <div className="login-meta">
              <span><Lock size={14} /> Dados privados por organizador</span>
              <span><BarChart3 size={14} /> Relatórios e ranking</span>
            </div>
          </div>

          <div className="login-card">
            <div className="card-heading">
              <div className="icon-tile"><Headphones size={20} /></div>
              <div>
                <h2>Operador / Aluno</h2>
                <p>Acesso individual liberado pelo instrutor.</p>
              </div>
            </div>
            <label>
              Código de acesso
              <input value={token} onChange={(event) => setToken(event.target.value)} />
            </label>
            <div className={`access-preview ${access ? statusMap[access.status]?.tone : 'danger'}`}>
              {access ? (
                <>
                  <strong>{scenario?.name}</strong>
                  <span>{statusMap[access.status]?.label} • {access.group}</span>
                </>
              ) : (
                <>
                  <strong>Acesso não encontrado</strong>
                  <span>Confira o código recebido</span>
                </>
              )}
            </div>
            <div className="split-inputs">
              <label>
                Nome
                <input value={name} onChange={(event) => setName(event.target.value)} />
              </label>
              <label>
                E-mail
                <input value={email} onChange={(event) => setEmail(event.target.value)} />
              </label>
            </div>
            <button className="primary-button" disabled={!canEnter || !name.trim()} onClick={() => onOperatorLogin(access, name, email)}>
              <Play size={16} />
              Iniciar acesso
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function Sidebar({ session, navItems, activePage, onNavigate, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="logo-mark small">PX</div>
        <div>
          <strong>PEX</strong>
          <span>{session.role === 'organizer' ? 'Instrutor' : 'Operador'}</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              className={activePage === item.id ? 'active' : ''}
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={item.label}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="sidebar-user">
        <div className="avatar">{session.avatar}</div>
        <div>
          <strong>{session.name}</strong>
          <span>{session.email || 'Acesso individual'}</span>
        </div>
        <button className="icon-button" onClick={onLogout} title="Sair">
          <LogOut size={17} />
        </button>
      </div>
    </aside>
  );
}

function Topbar({ title, session, accesses, results, onNavigate }) {
  const completed = accesses.filter((access) => access.status === 'concluida').length;
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">{session.role === 'organizer' ? 'Conta Google' : 'Acesso liberado'}</p>
        <h2>{title}</h2>
      </div>
      <div className="topbar-actions">
        {session.role === 'organizer' && (
          <>
            <button className="ghost-button" onClick={() => onNavigate('resultados')}>
              <ClipboardCheck size={16} />
              {completed} concluídas
            </button>
            <button className="primary-button compact" onClick={() => onNavigate('nova-simulacao')}>
              <Plus size={16} />
              Criar nova simulação
            </button>
          </>
        )}
        {session.role === 'operator' && (
          <button className="primary-button compact" onClick={() => onNavigate('atendimento')}>
            <Headphones size={16} />
            Atendimento
          </button>
        )}
        <div className="topbar-score">
          <Gauge size={16} />
          <span>{Math.round(results.reduce((sum, result) => sum + result.totalScore, 0) / Math.max(results.length, 1))}</span>
        </div>
      </div>
    </header>
  );
}

function OrganizerRouter(props) {
  const page = props.page;
  if (page === 'dashboard-organizador') return <OrganizerDashboard {...props} />;
  if (page === 'painel-organizador') return <OrganizerPanel {...props} />;
  if (page === 'nova-simulacao') return <SimulationBuilder {...props} />;
  if (page === 'gerar-acesso') return <AccessGenerator {...props} />;
  if (page === 'acessos') return <AccessManager {...props} />;
  if (page === 'resultados') return <ResultsList {...props} />;
  if (page === 'relatorios') return <ReportsPage {...props} />;
  if (page === 'ranking') return <RankingPage {...props} />;
  if (page === 'historico-conversa') return <ConversationHistory {...props} />;
  if (page === 'cadastro-cenario') return <ScenarioRegistry {...props} />;
  if (page === 'alunos') return <StudentsList {...props} />;
  if (page === 'perfil-aluno') return <StudentProfile {...props} />;
  if (page === 'voz') return <VoiceFuture />;
  if (page === 'configuracoes') return <SettingsPage session={props.session} />;
  return <OrganizerDashboard {...props} />;
}

function OperatorRouter(props) {
  const page = props.page;
  if (page === 'dashboard-operador') return <OperatorDashboard {...props} />;
  if (page === 'iniciar-simulacao') return <StartSimulation {...props} />;
  if (page === 'atendimento') return <SimulationChat {...props} />;
  if (page === 'voz') return <VoiceFuture />;
  if (page === 'resultado-operador') return <OperatorResult {...props} />;
  if (page === 'historico-operador') return <OperatorHistory {...props} />;
  if (page === 'relatorio-operador') return <OperatorReport {...props} />;
  if (page === 'configuracoes') return <SettingsPage session={props.session} />;
  return <OperatorDashboard {...props} />;
}

function OrganizerDashboard({ scenarios, accesses, results, setPage }) {
  const average = Math.round(results.reduce((sum, result) => sum + result.totalScore, 0) / Math.max(results.length, 1));
  const pending = accesses.filter((item) => ['pendente', 'ativa', 'pausada'].includes(item.status)).length;
  const expired = accesses.filter((item) => item.status === 'expirada').length;
  return (
    <div className="page-grid">
      <section className="stats-row">
        <MetricCard icon={Bot} label="Simulações criadas" value={scenarios.length} tone="info" />
        <MetricCard icon={KeyRound} label="Acessos liberados" value={accesses.length} tone="warning" />
        <MetricCard icon={CheckCircle2} label="Concluídas" value={results.length} tone="good" />
        <MetricCard icon={Gauge} label="Pontuação média" value={average} tone={scoreTone(average)} />
      </section>

      <section className="dashboard-layout">
        <Panel title="Evolução geral" action={<button className="ghost-button" onClick={() => setPage('relatorios')}><LineChart size={16} />Relatórios</button>}>
          <LineGraph values={[62, 70, 76, 74, 83, 88, average]} />
          <div className="graph-legend">
            <span><i className="dot good" /> Qualidade</span>
            <span><i className="dot info" /> TMA</span>
            <span><i className="dot warning" /> Oferta adicional</span>
          </div>
        </Panel>

        <Panel title="Situação dos acessos">
          <div className="status-stack">
            <StatusLine label="Pendentes e ativos" value={pending} max={accesses.length} tone="warning" />
            <StatusLine label="Concluídos" value={results.length} max={accesses.length} tone="good" />
            <StatusLine label="Expirados" value={expired} max={accesses.length} tone="muted" />
          </div>
        </Panel>
      </section>

      <section className="dashboard-layout thirds">
        <Panel
          title="Ranking de desempenho"
          action={<button className="ghost-button" onClick={() => setPage('ranking')}><Star size={16} />Ranking</button>}
        >
          <RankingList compact />
        </Panel>
        <Panel
          title="Últimas simulações"
          action={<button className="ghost-button" onClick={() => setPage('resultados')}><ClipboardCheck size={16} />Ver resultados</button>}
        >
          <ResultTimeline results={results} scenarios={scenarios} />
        </Panel>
        <Panel title="Ações rápidas">
          <div className="quick-actions">
            <button className="primary-button" onClick={() => setPage('nova-simulacao')}><FilePlus2 size={16} />Criar nova simulação</button>
            <button className="secondary-button" onClick={() => setPage('gerar-acesso')}><KeyRound size={16} />Gerar acesso</button>
            <button className="secondary-button" onClick={() => setPage('resultados')}><FileBarChart size={16} />Ver resultados</button>
          </div>
        </Panel>
      </section>
    </div>
  );
}

function OrganizerPanel({ accesses, results, scenarios, setPage }) {
  const recent = accesses.slice(0, 5);
  return (
    <div className="page-grid two-columns">
      <Panel title="Operação de treinamento">
        <div className="admin-map">
          {[
            { label: 'Criar cenário', icon: Target, page: 'cadastro-cenario' },
            { label: 'Liberar acesso', icon: KeyRound, page: 'gerar-acesso' },
            { label: 'Acompanhar alunos', icon: Users, page: 'alunos' },
            { label: 'Auditar conversa', icon: MessageCircle, page: 'historico-conversa' },
            { label: 'Gerar relatório', icon: FileBarChart, page: 'relatorios' }
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <button className="flow-step" key={item.label} onClick={() => setPage(item.page)}>
                <span>{index + 1}</span>
                <Icon size={20} />
                <strong>{item.label}</strong>
                <ChevronRight size={16} />
              </button>
            );
          })}
        </div>
      </Panel>
      <Panel title="Governança de acessos">
        <div className="table-list">
          {recent.map((access) => (
            <div className="table-row" key={access.id}>
              <div>
                <strong>{access.token}</strong>
                <span>{scenarioName(scenarios, access.scenarioId)} • {access.group}</span>
              </div>
              <StatusBadge status={access.status} />
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="Privacidade e vínculo com organizador">
        <div className="security-grid">
          <InfoPill icon={Lock} label="Dados por conta Google" value="instrutora@pex.com" />
          <InfoPill icon={ShieldCheck} label="Acesso único" value={`${accesses.length} tokens`} />
          <InfoPill icon={Archive} label="Histórico salvo" value={`${results.length} conversas`} />
          <InfoPill icon={Download} label="Exportação" value="PDF e planilha" />
        </div>
      </Panel>
      <Panel title="Arquitetura tecnológica">
        <div className="architecture">
          {['React', 'Google OAuth', 'API LLM', 'Node/Python API', 'PostgreSQL', 'PDF/XLSX', 'Speech futuro'].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function SimulationBuilder({ scenarios, setScenarios, setPage }) {
  const [form, setForm] = useState({
    name: 'Internet lenta com cliente confuso',
    type: 'Suporte técnico',
    difficulty: 'Médio',
    mood: 'Confuso',
    customer: 'Cliente PEX',
    objective: 'Diagnosticar lentidão, orientar testes e confirmar estabilidade.',
    summary: 'Cliente relata instabilidade e dificuldade para entender instruções técnicas.',
    history: 'Plano recém-instalado com dois chamados por oscilação.'
  });

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const save = () => {
    setScenarios((items) => [
      ...items,
      {
        ...form,
        id: `sce-${Date.now()}`,
        required: ['Escuta ativa', 'Clareza', 'Conhecimento técnico', 'Confirmação de entendimento']
      }
    ]);
    setPage('gerar-acesso');
  };

  return (
    <div className="page-grid two-columns">
      <Panel title="Criar nova simulação">
        <div className="form-grid">
          <label>Nome da simulação<input value={form.name} onChange={(event) => update('name', event.target.value)} /></label>
          <label>Tipo de atendimento<input value={form.type} onChange={(event) => update('type', event.target.value)} /></label>
          <label>Dificuldade<select value={form.difficulty} onChange={(event) => update('difficulty', event.target.value)}><option>Fácil</option><option>Médio</option><option>Difícil</option></select></label>
          <label>Humor inicial<select value={form.mood} onChange={(event) => update('mood', event.target.value)}><option>Calmo</option><option>Confuso</option><option>Irritado</option><option>Indeciso</option><option>Insatisfeito</option></select></label>
          <label>Cliente fictício<input value={form.customer} onChange={(event) => update('customer', event.target.value)} /></label>
          <label>Objetivo<input value={form.objective} onChange={(event) => update('objective', event.target.value)} /></label>
          <label className="wide">Histórico resumido<textarea value={form.history} onChange={(event) => update('history', event.target.value)} /></label>
          <label className="wide">Contexto do cenário<textarea value={form.summary} onChange={(event) => update('summary', event.target.value)} /></label>
        </div>
        <div className="button-row">
          <button className="primary-button" onClick={save}><Check size={16} />Salvar simulação</button>
          <button className="secondary-button" onClick={() => setPage('cadastro-cenario')}><Target size={16} />Ver cenários</button>
        </div>
      </Panel>
      <Panel title="Critérios obrigatórios">
        <CriteriaChecklist />
      </Panel>
    </div>
  );
}

function CriteriaChecklist() {
  return (
    <div className="criteria-list">
      {[
        'Qualidade no atendimento',
        'Oferta de outro produto',
        'Satisfação do cliente',
        'Boa argumentação',
        'Contorno do não',
        'Conhecimento técnico',
        'Resolução técnica',
        'Resolução financeira',
        'Tom e cordialidade',
        'Escuta ativa',
        'Clareza',
        'Personalização',
        'TMA',
        'Empatia',
        'Linguagem positiva',
        'Encerramento correto',
        'Confirmação de entendimento',
        'Situações difíceis'
      ].map((item, index) => (
        <label className="check-row" key={item}>
          <input type="checkbox" defaultChecked={index < 12} />
          <span>{item}</span>
        </label>
      ))}
    </div>
  );
}

function AccessGenerator({ scenarios, accesses, setAccesses, setPage }) {
  const [scenarioId, setScenarioId] = useState(scenarios[0]?.id || '');
  const [group, setGroup] = useState('Turma A');
  const [simulationName, setSimulationName] = useState('Treinamento técnico semanal');
  const [generated, setGenerated] = useState(null);

  const scenario = scenarios.find((item) => item.id === scenarioId);
  const generate = () => {
    const token = createToken((scenario?.type || 'SIM').slice(0, 3).toUpperCase());
    const access = {
      id: `acc-${Date.now()}`,
      token,
      link: `https://pex.local/s/${token}`,
      scenarioId,
      organizerEmail: 'instrutora@pex.com',
      simulationName,
      group,
      operatorName: 'Aguardando aluno',
      operatorEmail: '',
      status: 'pendente',
      createdAt: new Date().toISOString(),
      usedAt: '',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
      score: null
    };
    setAccesses((items) => [access, ...items]);
    setGenerated(access);
  };

  return (
    <div className="page-grid two-columns">
      <Panel title="Gerar acesso individual">
        <div className="form-grid">
          <label className="wide">Simulação<select value={scenarioId} onChange={(event) => setScenarioId(event.target.value)}>{scenarios.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
          <label>Turma ou grupo<input value={group} onChange={(event) => setGroup(event.target.value)} /></label>
          <label>Nome da liberação<input value={simulationName} onChange={(event) => setSimulationName(event.target.value)} /></label>
        </div>
        <div className="scenario-strip">
          <InfoPill icon={Bot} label="Cliente" value={scenario?.customer} />
          <InfoPill icon={Sparkles} label="Humor" value={scenario?.mood} />
          <InfoPill icon={SlidersHorizontal} label="Dificuldade" value={scenario?.difficulty} />
        </div>
        <div className="button-row">
          <button className="primary-button" onClick={generate}><KeyRound size={16} />Gerar acesso</button>
          <button className="secondary-button" onClick={() => setPage('acessos')}><LinkIcon size={16} />Gerenciar acessos</button>
        </div>
      </Panel>
      <Panel title="Acesso liberado">
        {generated ? (
          <div className="generated-token">
            <span>Código</span>
            <strong>{generated.token}</strong>
            <div className="token-link">
              <LinkIcon size={16} />
              <span>{generated.link}</span>
              <button className="icon-button" title="Copiar"><Copy size={16} /></button>
            </div>
            <StatusBadge status={generated.status} />
          </div>
        ) : (
          <EmptyState icon={KeyRound} title="Nenhum acesso gerado nesta sessão" text="Use o formulário para criar um token individual." />
        )}
      </Panel>
    </div>
  );
}

function AccessManager({ accesses, setAccesses, scenarios }) {
  const [filter, setFilter] = useState('');
  const filtered = accesses.filter((access) =>
    [access.token, access.operatorName, access.group, scenarioName(scenarios, access.scenarioId), access.status]
      .join(' ')
      .toLowerCase()
      .includes(filter.toLowerCase())
  );

  const updateStatus = (id, status) => {
    setAccesses((items) => items.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  return (
    <Panel title="Gerenciar acessos liberados" action={<SearchBox value={filter} onChange={setFilter} placeholder="Filtrar por nome, data, cenário, acesso ou pontuação" />}>
      <div className="responsive-table">
        <table>
          <thead>
            <tr>
              <th>Acesso</th>
              <th>Operador</th>
              <th>Simulação</th>
              <th>Status</th>
              <th>Uso</th>
              <th>Pontuação</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((access) => (
              <tr key={access.id}>
                <td><strong>{access.token}</strong><span>{access.group}</span></td>
                <td><strong>{access.operatorName}</strong><span>{access.operatorEmail || 'Sem e-mail'}</span></td>
                <td>{scenarioName(scenarios, access.scenarioId)}</td>
                <td><StatusBadge status={access.status} /></td>
                <td>{access.usedAt ? formatDate(access.usedAt) : 'Não utilizado'}</td>
                <td>{access.score ? <ScorePill score={access.score} /> : '-'}</td>
                <td>
                  <div className="row-actions">
                    <button className="icon-button" title="Ativar" onClick={() => updateStatus(access.id, 'ativa')}><Check size={15} /></button>
                    <button className="icon-button" title="Pausar" onClick={() => updateStatus(access.id, 'pausada')}><PauseCircle size={15} /></button>
                    <button className="icon-button" title="Cancelar" onClick={() => updateStatus(access.id, 'cancelada')}><StopCircle size={15} /></button>
                    <button className="icon-button" title="Reenviar"><Mail size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function ResultsList({ results, scenarios, accesses, setSelectedResultId, setPage }) {
  const [filter, setFilter] = useState('');
  const filtered = results.filter((result) =>
    [result.operatorName, result.scenarioName, result.token, result.totalScore, result.date]
      .join(' ')
      .toLowerCase()
      .includes(filter.toLowerCase())
  );
  const average = Math.round(results.reduce((sum, result) => sum + result.totalScore, 0) / Math.max(results.length, 1));

  return (
    <div className="page-grid">
      <section className="stats-row">
        <MetricCard icon={ClipboardCheck} label="Operadores avaliados" value={new Set(results.map((item) => item.operatorEmail)).size} tone="info" />
        <MetricCard icon={Gauge} label="Média geral da turma" value={average} tone={scoreTone(average)} />
        <MetricCard icon={CheckCircle2} label="Concluídas" value={results.length} tone="good" />
        <MetricCard icon={Clock3} label="Pendentes" value={accesses.filter((item) => ['pendente', 'ativa'].includes(item.status)).length} tone="warning" />
      </section>
      <Panel
        title="Resultados das Simulações"
        action={<div className="button-row tight"><SearchBox value={filter} onChange={setFilter} placeholder="Filtrar resultados" /><button className="secondary-button"><ArrowDownToLine size={16} />PDF</button><button className="secondary-button"><Download size={16} />Planilha</button></div>}
      >
        <div className="responsive-table">
          <table>
            <thead>
              <tr>
                <th>Operador</th>
                <th>Simulação</th>
                <th>Data</th>
                <th>TMA</th>
                <th>Pontuação</th>
                <th>Classificação</th>
                <th>Detalhes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((result) => (
                <tr key={result.id}>
                  <td><strong>{result.operatorName}</strong><span>{result.operatorEmail}</span></td>
                  <td>{result.scenarioName || scenarioName(scenarios, result.scenarioId)}</td>
                  <td>{formatDate(result.date)}</td>
                  <td>{result.totalTime}</td>
                  <td><ScorePill score={result.totalScore} /></td>
                  <td>{scoreClass(result.totalScore)}</td>
                  <td>
                    <button className="ghost-button" onClick={() => { setSelectedResultId(result.id); setPage('historico-conversa'); }}>
                      <MessageCircle size={16} />
                      Conversa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function ReportsPage({ results }) {
  const average = Math.round(results.reduce((sum, result) => sum + result.totalScore, 0) / Math.max(results.length, 1));
  return (
    <div className="page-grid two-columns">
      <Panel title="Relatório de desempenho">
        <div className="report-head">
          <div>
            <span>Média atual</span>
            <strong>{average}</strong>
            <em>{scoreClass(average)}</em>
          </div>
          <GaugeChart value={average} />
        </div>
        <ScoreBars scores={aggregateScores(results)} />
      </Panel>
      <Panel title="Comparativo entre simulações">
        <BarGraph
          items={results.map((result) => ({
            label: result.operatorName.split(' ')[0],
            value: result.totalScore,
            tone: scoreTone(result.totalScore)
          }))}
        />
      </Panel>
      <Panel title="Principais dificuldades">
        <div className="insight-list">
          <InsightItem tone="warning" icon={AlertTriangle} title="Oferta adicional" text="Aparece tarde ou sem conexão direta com a necessidade do cliente." />
          <InsightItem tone="info" icon={MessageCircle} title="Confirmação de entendimento" text="Operadores resolvem, mas nem sempre validam se o cliente compreendeu." />
          <InsightItem tone="good" icon={CheckCircle2} title="Cordialidade" text="Tom inicial está consistente nas últimas simulações." />
        </div>
      </Panel>
      <Panel title="Recomendações de treinamento">
        <div className="recommendations">
          {['Roleplay de objeções financeiras', 'Checklist de encerramento com protocolo', 'Treino de oferta consultiva pós-solução', 'Scripts de linguagem positiva'].map((item) => (
            <button key={item}><GraduationCap size={16} />{item}</button>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function RankingPage() {
  return (
    <Panel title="Ranking de operadores">
      <RankingList />
    </Panel>
  );
}

function ConversationHistory({ results, selectedResultId, setSelectedResultId }) {
  const selected = results.find((result) => result.id === selectedResultId) || results[0];
  return (
    <div className="page-grid two-columns wide-left">
      <Panel title="Histórico por operador">
        <div className="conversation-selector">
          {results.map((result) => (
            <button
              key={result.id}
              className={selected?.id === result.id ? 'active' : ''}
              onClick={() => setSelectedResultId(result.id)}
            >
              <span>{result.operatorName}</span>
              <ScorePill score={result.totalScore} />
            </button>
          ))}
        </div>
      </Panel>
      <Panel title="Detalhes da simulação realizada">
        {selected ? (
          <DetailedResult result={selected} />
        ) : (
          <EmptyState icon={MessageCircle} title="Sem conversas concluídas" text="As conversas finalizadas aparecem aqui." />
        )}
      </Panel>
    </div>
  );
}

function ScenarioRegistry({ scenarios, setScenarios }) {
  const [selectedId, setSelectedId] = useState(scenarios[0]?.id || '');
  const selected = scenarios.find((item) => item.id === selectedId) || scenarios[0];
  const updateSelected = (field, value) => {
    setScenarios((items) => items.map((item) => (item.id === selected.id ? { ...item, [field]: value } : item)));
  };

  return (
    <div className="page-grid two-columns">
      <Panel title="Lista de cenários">
        <div className="scenario-list">
          {scenarios.map((scenario) => (
            <button key={scenario.id} className={selected?.id === scenario.id ? 'active' : ''} onClick={() => setSelectedId(scenario.id)}>
              <div>
                <strong>{scenario.name}</strong>
                <span>{scenario.type} • {scenario.difficulty}</span>
              </div>
              <Badge tone={moodColor[scenario.mood] || 'info'}>{scenario.mood}</Badge>
            </button>
          ))}
        </div>
      </Panel>
      <Panel title="Cadastro de cenário">
        {selected && (
          <div className="form-grid">
            <label className="wide">Nome<input value={selected.name} onChange={(event) => updateSelected('name', event.target.value)} /></label>
            <label>Tipo<input value={selected.type} onChange={(event) => updateSelected('type', event.target.value)} /></label>
            <label>Dificuldade<select value={selected.difficulty} onChange={(event) => updateSelected('difficulty', event.target.value)}><option>Fácil</option><option>Médio</option><option>Difícil</option></select></label>
            <label>Perfil emocional<select value={selected.mood} onChange={(event) => updateSelected('mood', event.target.value)}><option>Calmo</option><option>Confuso</option><option>Irritado</option><option>Indeciso</option><option>Insatisfeito</option></select></label>
            <label>Cliente<input value={selected.customer} onChange={(event) => updateSelected('customer', event.target.value)} /></label>
            <label className="wide">Objetivo<textarea value={selected.objective} onChange={(event) => updateSelected('objective', event.target.value)} /></label>
            <label className="wide">Histórico resumido<textarea value={selected.history} onChange={(event) => updateSelected('history', event.target.value)} /></label>
          </div>
        )}
      </Panel>
    </div>
  );
}

function StudentsList({ setSelectedStudentId, setPage }) {
  return (
    <Panel title="Lista de alunos">
      <div className="student-grid">
        {students.map((student) => (
          <button
            className="student-card"
            key={student.id}
            onClick={() => {
              setSelectedStudentId(student.id);
              setPage('perfil-aluno');
            }}
          >
            <div className="avatar">{initials(student.name)}</div>
            <div>
              <strong>{student.name}</strong>
              <span>{student.email}</span>
              <em>{student.group}</em>
            </div>
            <ScorePill score={student.score} />
          </button>
        ))}
      </div>
    </Panel>
  );
}

function StudentProfile({ selectedStudentId, results }) {
  const student = students.find((item) => item.id === selectedStudentId) || students[0];
  const related = results.filter((result) => result.operatorEmail === student.email);
  return (
    <div className="page-grid two-columns">
      <Panel title="Perfil do aluno">
        <div className="profile-head">
          <div className="avatar large">{initials(student.name)}</div>
          <div>
            <h3>{student.name}</h3>
            <p>{student.email}</p>
            <Badge tone={student.status === 'Reforço' ? 'warning' : 'good'}>{student.status}</Badge>
          </div>
        </div>
        <div className="security-grid">
          <InfoPill icon={Users} label="Turma" value={student.group} />
          <InfoPill icon={Gauge} label="Média" value={student.score} />
          <InfoPill icon={LineChart} label="Tendência" value={student.trend} />
          <InfoPill icon={Bot} label="Simulações" value={student.simulations} />
        </div>
      </Panel>
      <Panel title="Histórico do aluno">
        {related.length ? <ResultTimeline results={related} /> : <EmptyState icon={History} title="Sem simulações concluídas" text="Histórico individual em formação." />}
      </Panel>
    </div>
  );
}

function OperatorDashboard({ session, accesses, scenarios, results, selectedAccessId, setPage }) {
  const access = accesses.find((item) => item.id === selectedAccessId || item.id === session.accessId);
  const scenario = scenarios.find((item) => item.id === access?.scenarioId);
  const lastResult = results.find((item) => item.accessId === access?.id);
  return (
    <div className="page-grid">
      <section className="operator-hero">
        <div>
          <p className="eyebrow">Operador</p>
          <h2>{session.name}</h2>
          <p>{scenario?.name}</p>
        </div>
        <StatusBadge status={access?.status || 'pendente'} />
      </section>
      <section className="stats-row">
        <MetricCard icon={KeyRound} label="Acesso" value={access?.token || '-'} tone="info" />
        <MetricCard icon={Bot} label="Cenário" value={scenario?.type || '-'} tone="warning" />
        <MetricCard icon={Sparkles} label="Humor inicial" value={scenario?.mood || '-'} tone={moodColor[scenario?.mood] || 'info'} />
        <MetricCard icon={Gauge} label="Última pontuação" value={lastResult?.totalScore || '-'} tone={lastResult ? scoreTone(lastResult.totalScore) : 'muted'} />
      </section>
      <div className="dashboard-layout">
        <Panel title="Simulação disponível">
          <ScenarioBrief scenario={scenario} />
          <button className="primary-button" onClick={() => setPage('atendimento')} disabled={!access || ['pausada', 'cancelada', 'expirada'].includes(access.status)}>
            <Play size={16} />
            Iniciar simulação
          </button>
        </Panel>
        <Panel title="Resultado recente">
          {lastResult ? <DetailedScoreMini result={lastResult} /> : <EmptyState icon={Gauge} title="Pontuação em aberto" text="O resultado aparece ao finalizar a simulação." />}
        </Panel>
      </div>
    </div>
  );
}

function StartSimulation({ session, accesses, scenarios, selectedAccessId, setPage }) {
  const access = accesses.find((item) => item.id === selectedAccessId || item.id === session.accessId);
  const scenario = scenarios.find((item) => item.id === access?.scenarioId);
  return (
    <div className="page-grid two-columns">
      <Panel title="Iniciar simulação">
        <ScenarioBrief scenario={scenario} />
        <div className="button-row">
          <button className="primary-button" onClick={() => setPage('atendimento')} disabled={!access || !['pendente', 'ativa'].includes(access.status)}>
            <Headphones size={16} />
            Iniciar atendimento
          </button>
          <button className="secondary-button" onClick={() => setPage('voz')}><Mic size={16} />Modo voz</button>
        </div>
      </Panel>
      <Panel title="Controle de acesso">
        <div className="security-grid">
          <InfoPill icon={KeyRound} label="Token" value={access?.token || '-'} />
          <InfoPill icon={ShieldCheck} label="Organizador" value={access?.organizerEmail || '-'} />
          <InfoPill icon={Clock3} label="Expira em" value={formatDate(access?.expiresAt)} />
          <InfoPill icon={Lock} label="Privacidade" value="Individual" />
        </div>
      </Panel>
    </div>
  );
}

function SimulationChat({ session, scenarios, accesses, setAccesses, results, setResults, selectedAccessId, setSelectedResultId, setPage }) {
  const access = accesses.find((item) => item.id === selectedAccessId || item.id === session.accessId);
  const scenario = scenarios.find((item) => item.id === access?.scenarioId) || scenarios[0];
  const [messages, setMessages] = useState(() => baseMessages[scenario?.id]?.slice(0, 1) || []);
  const [input, setInput] = useState('');
  const [elapsed, setElapsed] = useState(74);
  const [step, setStep] = useState(0);
  const [mood, setMood] = useState(scenario?.mood || 'Confuso');
  const scrollRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const nextStep = Math.min(stages.length - 1, step + 1);
    const operatorMessage = {
      author: session.name,
      role: 'agent',
      text: input.trim(),
      time: secondsToClock(elapsed)
    };
    const reply = {
      author: scenario.customer,
      role: 'customer',
      text: customerReply(input, scenario, nextStep),
      time: secondsToClock(elapsed + 7)
    };
    const positive = ['entendo', 'sinto', 'desculpa', 'claro', 'vou ajudar', 'solucao'].some((word) => input.toLowerCase().includes(word));
    setMood(positive ? (nextStep > 3 ? 'Calmo' : 'Confuso') : 'Insatisfeito');
    setMessages((items) => [...items, operatorMessage, reply]);
    setInput('');
    setStep(nextStep);
  };

  const finish = () => {
    const evaluation = scoreConversation(messages, elapsed, scenario);
    const result = {
      id: `res-${Date.now()}`,
      accessId: access.id,
      operatorName: session.name,
      operatorEmail: session.email,
      scenarioId: scenario.id,
      scenarioName: scenario.name,
      token: access.token,
      organizerEmail: access.organizerEmail,
      date: new Date().toISOString(),
      totalTime: timeLabel(elapsed),
      totalScore: evaluation.total,
      scores: evaluation.scores,
      strengths: evaluation.strengths,
      improvements: evaluation.improvements,
      feedback: evaluation.feedback,
      transcript: messages
    };
    setResults((items) => [result, ...items.filter((item) => item.accessId !== access.id)]);
    setAccesses((items) =>
      items.map((item) =>
        item.id === access.id
          ? {
              ...item,
              status: 'concluida',
              usedAt: new Date().toISOString(),
              operatorName: session.name,
              operatorEmail: session.email,
              score: evaluation.total,
              resultId: result.id
            }
          : item
      )
    );
    setSelectedResultId(result.id);
    setPage('resultado-operador');
  };

  if (!access || !['pendente', 'ativa', 'concluida'].includes(access.status)) {
    return <EmptyState icon={Lock} title="Acesso indisponível" text="A simulação precisa de um acesso ativo e autorizado." />;
  }

  return (
    <div className="simulation-layout">
      <section className="call-sidebar">
        <div className="customer-card">
          <div className="avatar large">{initials(scenario.customer)}</div>
          <h3>{scenario.customer}</h3>
          <Badge tone={moodColor[mood] || 'info'}>{mood}</Badge>
        </div>
        <InfoPill icon={Bot} label="Tipo" value={scenario.type} />
        <InfoPill icon={Clock3} label="Cronômetro" value={secondsToClock(elapsed)} />
        <InfoPill icon={KeyRound} label="Acesso" value={access.token} />
        <div className="stage-list">
          {stages.map((stage, index) => (
            <div className={index <= step ? 'done' : ''} key={stage}>
              <span>{index + 1}</span>
              {stage}
            </div>
          ))}
        </div>
        <button className="secondary-button full" onClick={() => setPage('voz')}><Mic size={16} />Atendimento por voz</button>
      </section>
      <section className="chat-panel">
        <div className="chat-header">
          <div>
            <strong>{scenario.name}</strong>
            <span>{scenario.summary}</span>
          </div>
          <button className="primary-button compact" onClick={finish}><ClipboardCheck size={16} />Finalizar</button>
        </div>
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div className={`message ${message.role}`} key={`${message.time}-${index}`}>
              <span>{message.author} • {message.time}</span>
              <p>{message.text}</p>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
        <div className="chat-composer">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && send()}
            placeholder="Responder ao cliente"
          />
          <button className="primary-button compact" onClick={send}><MessageCircle size={16} />Enviar</button>
        </div>
      </section>
    </div>
  );
}

function OperatorResult({ session, accesses, results, selectedAccessId, selectedResultId }) {
  const access = accesses.find((item) => item.id === selectedAccessId || item.id === session.accessId);
  const result = results.find((item) => item.id === selectedResultId) || results.find((item) => item.accessId === access?.id);
  return result ? <DetailedResult result={result} /> : <EmptyState icon={Gauge} title="Resultado ainda não gerado" text="Finalize a simulação para ver pontuação e feedback." />;
}

function OperatorHistory({ session, results }) {
  const mine = results.filter((item) => item.operatorEmail === session.email || item.operatorName === session.name);
  return (
    <Panel title="Histórico de simulações">
      {mine.length ? <ResultTimeline results={mine} detailed /> : <EmptyState icon={History} title="Histórico vazio" text="As simulações concluídas aparecem aqui." />}
    </Panel>
  );
}

function OperatorReport({ session, results }) {
  const mine = results.filter((item) => item.operatorEmail === session.email || item.operatorName === session.name);
  const average = Math.round(mine.reduce((sum, result) => sum + result.totalScore, 0) / Math.max(mine.length, 1));
  return (
    <div className="page-grid two-columns">
      <Panel title="Relatório individual">
        <div className="report-head">
          <div>
            <span>Pontuação média</span>
            <strong>{mine.length ? average : '-'}</strong>
            <em>{mine.length ? scoreClass(average) : 'Sem dados'}</em>
          </div>
          <GaugeChart value={mine.length ? average : 0} />
        </div>
        {mine.length ? <ScoreBars scores={aggregateScores(mine)} /> : <EmptyState icon={Gauge} title="Sem pontuação" text="Conclua uma simulação para gerar o relatório." />}
      </Panel>
      <Panel title="Próximas práticas">
        <div className="recommendations">
          {['Abertura com identificação clara', 'Frases de empatia e acolhimento', 'Oferta adicional consultiva', 'Encerramento com confirmação'].map((item) => (
            <button key={item}><ListChecks size={16} />{item}</button>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function VoiceFuture() {
  return (
    <div className="page-grid two-columns">
      <Panel title="Atendimento por voz">
        <div className="voice-console">
          <div className="voice-orbit">
            <Mic size={34} />
          </div>
          <div className="waveform">
            {Array.from({ length: 26 }).map((_, index) => (
              <span style={{ height: `${18 + ((index * 7) % 46)}px` }} key={index} />
            ))}
          </div>
          <div className="button-row">
            <button className="primary-button"><Mic size={16} />Gravar</button>
            <button className="secondary-button"><StopCircle size={16} />Parar</button>
          </div>
        </div>
      </Panel>
      <Panel title="Fila de transcrição">
        <div className="transcript-preview">
          <div><span>00:03</span><p>Operador inicia abertura com identificação.</p></div>
          <div><span>00:18</span><p>Cliente relata problema e demonstra irritação.</p></div>
          <div><span>00:42</span><p>IA classifica tom, clareza e empatia em tempo real.</p></div>
        </div>
        <div className="architecture">
          <span>Speech-to-Text</span>
          <span>Text-to-Speech</span>
          <span>Análise de tom</span>
          <span>TMA por fala</span>
        </div>
      </Panel>
    </div>
  );
}

function SettingsPage({ session }) {
  return (
    <div className="page-grid two-columns">
      <Panel title="Configurações da plataforma">
        <div className="settings-list">
          <label className="switch-row"><span>Exibir pontuação ao operador</span><input type="checkbox" defaultChecked /></label>
          <label className="switch-row"><span>Salvar transcrição completa</span><input type="checkbox" defaultChecked /></label>
          <label className="switch-row"><span>Permitir reenviar acesso expirado</span><input type="checkbox" defaultChecked /></label>
          <label className="switch-row"><span>Aplicar avaliação de TMA</span><input type="checkbox" defaultChecked /></label>
        </div>
      </Panel>
      <Panel title="Conta">
        <div className="profile-head">
          <div className="avatar large">{session.avatar}</div>
          <div>
            <h3>{session.name}</h3>
            <p>{session.email || 'Operador com acesso individual'}</p>
            <Badge tone="good">{session.role === 'organizer' ? 'Organizador' : 'Operador'}</Badge>
          </div>
        </div>
      </Panel>
    </div>
  );
}

function DetailedResult({ result }) {
  return (
    <div className="result-detail">
      <section className="result-summary">
        <div>
          <p className="eyebrow">Pontuação total</p>
          <h2>{result.totalScore}</h2>
          <Badge tone={scoreTone(result.totalScore)}>{scoreClass(result.totalScore)}</Badge>
        </div>
        <GaugeChart value={result.totalScore} />
      </section>
      <section className="result-grid">
        <Panel title="Pontuação por categoria">
          <ScoreBars scores={result.scores} />
        </Panel>
        <Panel title="Feedback gerado por IA">
          <p className="feedback-text">{result.feedback}</p>
          <div className="feedback-columns">
            <div>
              <strong>Pontos fortes</strong>
              {result.strengths.map((item) => <span key={item}><CheckCircle2 size={15} />{item}</span>)}
            </div>
            <div>
              <strong>Pontos de melhoria</strong>
              {result.improvements.map((item) => <span key={item}><AlertTriangle size={15} />{item}</span>)}
            </div>
          </div>
        </Panel>
      </section>
      <Panel title="Histórico completo da conversa">
        <div className="transcript-list">
          {result.transcript.map((message, index) => (
            <div className={`transcript-item ${message.role}`} key={`${message.time}-${index}`}>
              <span>{message.time}</span>
              <strong>{message.author}</strong>
              <p>{message.text}</p>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="Sugestões para a próxima simulação">
        <div className="recommendations">
          {['Confirmar entendimento antes de resolver', 'Conectar oferta adicional ao benefício percebido', 'Encerrar com protocolo e disponibilidade', 'Reduzir repetições para melhorar TMA'].map((item) => (
            <button key={item}><Sparkles size={16} />{item}</button>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function DetailedScoreMini({ result }) {
  return (
    <div className="mini-result">
      <ScorePill score={result.totalScore} />
      <strong>{scoreClass(result.totalScore)}</strong>
      <p>{result.feedback}</p>
    </div>
  );
}

function ScenarioBrief({ scenario }) {
  if (!scenario) return <EmptyState icon={Target} title="Cenário não encontrado" text="O acesso não tem simulação ativa." />;
  return (
    <div className="scenario-brief">
      <div>
        <p className="eyebrow">{scenario.type}</p>
        <h3>{scenario.name}</h3>
        <span>{scenario.summary}</span>
      </div>
      <div className="security-grid">
        <InfoPill icon={UserCheck} label="Cliente" value={scenario.customer} />
        <InfoPill icon={Sparkles} label="Humor" value={scenario.mood} />
        <InfoPill icon={SlidersHorizontal} label="Nível" value={scenario.difficulty} />
        <InfoPill icon={Target} label="Objetivo" value={scenario.objective} />
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, tone = 'info' }) {
  return (
    <article className={`metric-card ${tone}`}>
      <div className="icon-tile"><Icon size={20} /></div>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function Panel({ title, action, children }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h3>{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function StatusBadge({ status }) {
  const data = statusMap[status] || statusMap.pendente;
  const Icon = data.icon;
  return (
    <Badge tone={data.tone}>
      <Icon size={14} />
      {data.label}
    </Badge>
  );
}

function Badge({ tone = 'info', children }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

function ScorePill({ score }) {
  return <span className={`score-pill ${scoreTone(score)}`}>{score}</span>;
}

function InfoPill({ icon: Icon, label, value }) {
  return (
    <div className="info-pill">
      <Icon size={16} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function EmptyState({ icon: Icon, title, text }) {
  return (
    <div className="empty-state">
      <Icon size={28} />
      <strong>{title}</strong>
      <span>{text}</span>
    </div>
  );
}

function SearchBox({ value, onChange, placeholder }) {
  return (
    <label className="search-box">
      <Search size={16} />
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </label>
  );
}

function StatusLine({ label, value, max, tone }) {
  return (
    <div className="status-line">
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="progress-track">
        <i className={tone} style={{ width: `${Math.max(8, (value / Math.max(max, 1)) * 100)}%` }} />
      </div>
    </div>
  );
}

function LineGraph({ values }) {
  const points = values.map((value, index) => `${(index / (values.length - 1)) * 100},${100 - value}`).join(' ');
  return (
    <div className="line-graph">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline points={points} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="graph-axis">
        {values.map((value, index) => <span key={`${value}-${index}`}>{value}</span>)}
      </div>
    </div>
  );
}

function BarGraph({ items }) {
  return (
    <div className="bar-graph">
      {items.map((item) => (
        <div key={item.label}>
          <span>{item.label}</span>
          <div className="progress-track">
            <i className={item.tone} style={{ width: `${item.value}%` }} />
          </div>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  );
}

function GaugeChart({ value }) {
  const rotate = Math.max(-90, Math.min(90, -90 + (value / 100) * 180));
  return (
    <div className="gauge-chart" style={{ '--rotation': `${rotate}deg` }}>
      <div className="gauge-arc" />
      <div className="gauge-needle" />
      <strong>{value}</strong>
    </div>
  );
}

function ScoreBars({ scores }) {
  const entries = criteriaTemplate.map((criteria) => ({
    ...criteria,
    value: scores?.[criteria.key] ?? 0
  }));
  return (
    <div className="score-bars">
      {entries.map((entry) => (
        <div key={entry.key}>
          <div>
            <span>{entry.label}</span>
            <strong>{entry.value}/{entry.max}</strong>
          </div>
          <div className="progress-track">
            <i className={scoreTone((entry.value / entry.max) * 100)} style={{ width: `${(entry.value / entry.max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function aggregateScores(results) {
  if (!results.length) return {};
  return criteriaTemplate.reduce((acc, criteria) => {
    acc[criteria.key] = Math.round(results.reduce((sum, result) => sum + (result.scores?.[criteria.key] || 0), 0) / results.length);
    return acc;
  }, {});
}

function RankingList({ compact = false }) {
  const sorted = [...students].sort((a, b) => b.score - a.score);
  return (
    <div className={`ranking-list ${compact ? 'compact' : ''}`}>
      {sorted.map((student, index) => (
        <div className="ranking-row" key={student.id}>
          <span className="rank">{index + 1}</span>
          <div className="avatar">{initials(student.name)}</div>
          <div>
            <strong>{student.name}</strong>
            <span>{student.group} • {student.simulations} simulações</span>
          </div>
          <ScorePill score={student.score} />
        </div>
      ))}
    </div>
  );
}

function ResultTimeline({ results, detailed = false }) {
  return (
    <div className="timeline">
      {results.map((result) => (
        <div className="timeline-item" key={result.id}>
          <span className={`timeline-dot ${scoreTone(result.totalScore)}`} />
          <div>
            <strong>{result.operatorName}</strong>
            <p>{result.scenarioName} • {formatDate(result.date)}</p>
            {detailed && <em>{result.feedback}</em>}
          </div>
          <ScorePill score={result.totalScore} />
        </div>
      ))}
    </div>
  );
}

function InsightItem({ icon: Icon, tone, title, text }) {
  return (
    <div className={`insight-item ${tone}`}>
      <Icon size={18} />
      <div>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>
    </div>
  );
}

function scenarioName(scenarios, id) {
  return scenarios.find((scenario) => scenario.id === id)?.name || 'Simulação removida';
}

createRoot(document.getElementById('root')).render(<App />);
