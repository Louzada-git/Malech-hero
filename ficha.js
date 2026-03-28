const ATTRS = [
  { key: 'forca', nome: 'Força' },
  { key: 'destreza', nome: 'Destreza' },
  { key: 'vigor', nome: 'Vigor' },
  { key: 'intelecto', nome: 'Intelecto' },
  { key: 'poder', nome: 'Poder' }
];

const ATTR_COST = { 8: -2, 9: -1, 10: 0, 11: 1, 12: 2, 13: 2, 14: 3, 15: 4, 16: 6, 17: 8, 18: 10, 19: 11, 20: 12 };
const BASE_ATTR_BUDGET = 28;

const ORIGENS = {
  nenhuma: { nome: 'Nenhuma', obs: 'Sem ajustes.' },
  experimento: { nome: 'Experimento', obs: '-2 FOR/-2 VIG ou -2 AGI/-2 VIG, +4 POD (ajuste manual).' },
  favelado: { nome: 'Favelado', obs: '-4 VIG, +4 DES, começa com menos recursos.' },
  vigilante: { nome: 'Vigilante', obs: '+10 pontos de combate, cicatriz mental inicial.' },
  indispertado: { nome: 'Indispertado', obs: 'Poder selado, corpo físico elevado (ajuste manual).' },
  ex_possuido: { nome: 'Ex-possuído', obs: '+6 POD, -4 VIG.' },
  amnesico: { nome: 'Amnésico', obs: '+4 em um atributo, -2 em Intelecto (manual).' },
  nomade: { nome: 'Nômade', obs: '+2 DES e mobilidade maior (manual).' },
  vitima: { nome: 'Vítima', obs: '+15 PC e +15 PdE iniciais.' },
  cacado: { nome: 'Caçado', obs: 'Conflitos frequentes, XP dobrado nesses embates (regra de mesa).' }
};

const CATEGORIAS = ['Ataque', 'Mente', 'Suporte', 'Defesa', 'Geral'];

const BASE_PERICIAS = [
  'Atletismo', 'Acrobacia', 'Furtividade*', 'Reflexos', 'Crime*', 'História', 'Investigação',
  'Natureza', 'Religião+*', 'Intuição', 'Medicina+*', 'Percepção', 'Sobrevivência*', 'Fortitude', 'Pilotagem'
].map((nome) => ({ nome, desc: 'Perícia base do sistema.' }));

const EFEITOS = [
  { key: 'dano', nome: 'Dano', custo: 7, categoria: 'Ataque/Mente', acao: 'Padrão', alcance: 'Toque/Médio', desc: 'Dano = (rank÷3) + (mana÷10)d6 + (mana÷2) + poder. Alvo pode resistir para reduzir à metade.' },
  { key: 'criar', nome: 'Criar', custo: 10, categoria: 'Geral', acao: 'Padrão', alcance: 'Curto', desc: 'Cria objeto de até 15kg×rank. Ganha melhorias a cada 3 ranks.' },
  { key: 'condicao', nome: 'Condição', custo: 15, categoria: 'Suporte', acao: 'Turno', alcance: 'x', desc: 'Impõe condições debilitantes por contato.' },
  { key: 'paralisar', nome: 'Paralisar', custo: 8, categoria: 'Suporte/Mente', acao: 'Padrão', alcance: 'Toque/Curto', desc: 'Imobiliza por 1 turno ou reduz FOR/DES conforme alcance.' },
  { key: 'anular', nome: 'Anular', custo: 3, categoria: 'Mente', acao: 'Bônus/Reação', alcance: 'Ilimitado', desc: 'Cancela um poder ativo na cena.' },
  { key: 'invocacao', nome: 'Invocação', custo: 5, categoria: 'Suporte', acao: 'Movimento', alcance: 'Curto', desc: 'Invoca criatura aliada com atributos em função do rank e mana gasta.' },
  { key: 'transformacao', nome: 'Transformação', custo: 25, categoria: 'Geral', acao: 'Padrão', alcance: 'Pessoal', desc: 'Aumenta atributos (2x25% ou 1x50%). Vigor extra vira HP temporário.' },
  { key: 'mover_objeto', nome: 'Mover Objeto', custo: 3, categoria: 'Mente', acao: 'Movimento', alcance: 'x', desc: 'Move objetos a distância com escala por peso/rank.' },
  { key: 'teleporte', nome: 'Teleporte', custo: 25, categoria: 'Geral/Mente', acao: 'Bônus', alcance: 'x', desc: 'Movimento instantâneo com base no rank.' },
  { key: 'barreira', nome: 'Barreira', custo: 5, categoria: 'Defesa', acao: 'Movimento', alcance: 'Médio', desc: 'Cria barreira com HP baseado em mana e rank.' },
  { key: 'cura', nome: 'Cura', custo: 5, categoria: 'Suporte', acao: 'Movimento', alcance: 'Médio', desc: 'Cura = mana×2 + rank×4 (toque melhora fórmula).' },
  { key: 'comunicacao', nome: 'Comunicação', custo: 3, categoria: 'Mente', acao: 'Bônus', alcance: 'x', desc: 'Conexão mental de alcance crescente por rank.' },
  { key: 'auto_transfiguracao', nome: 'Auto-transfiguração', custo: 7, categoria: 'Suporte', acao: 'Movimento', alcance: 'Pessoal', desc: 'Modifica o próprio corpo; mais modificações com rank.' },
  { key: 'voo', nome: 'Voo', custo: 15, categoria: 'Geral', acao: 'Movimento', alcance: 'Pessoal', desc: 'Permite voo com velocidade escalada por rank.' }
];

const APTIDOES = [
  { key: 'acerto_critico', nome: 'Acerto Crítico Aprimorado', custo: 5, desc: 'Aumenta margem de ameaça em 1 com arma escolhida.' },
  { key: 'agarrar_aprimorado', nome: 'Agarrar Aprimorado', custo: 2, desc: 'Não provoca oportunidade ao agarrar e ganha bônus no teste.' },
  { key: 'ataque_atordoante', nome: 'Ataque Atordoante', custo: 5, desc: 'Ataque desarmado pode atordoar alvo por 1 rodada (usos limitados).' },
  { key: 'ataque_duplo', nome: 'Ataque Duplo', custo: 12, desc: 'Executa dois ataques na mesma ação padrão.' },
  { key: 'ataque_triplo', nome: 'Ataque Triplo', custo: 25, desc: 'Executa três ataques na mesma ação padrão.' },
  { key: 'ataque_giratorio', nome: 'Ataque Giratório', custo: 3, desc: 'Atinge todos os adjacentes (ação completa).' },
  { key: 'ataque_poderoso', nome: 'Ataque Poderoso', custo: 3, desc: 'Perde precisão para ganhar grande bônus de dano.' },
  { key: 'duas_armas', nome: 'Combater com Duas Armas', custo: 15, desc: 'Ataca com ambas as mãos na mesma ação padrão.' },
  { key: 'passo_fantasma', nome: 'Passo Fantasma', custo: 4, desc: 'Reposiciona 1,5m após atacar sem oportunidade.' },
  { key: 'foco', nome: 'Foco', custo: 8, desc: 'Rerrola um teste por rodada (uso limitado).' },
  { key: 'reflexo_combate', nome: 'Reflexo de Combate', custo: 3, desc: 'Ação de oportunidade extra por rodada.' },
  { key: 'bloqueio_melhorado', nome: 'Bloqueio Melhorado', custo: 3, desc: '+3 em bloqueios e protege aliado adjacente.' }
];

const TALENTOS = [
  { key: 'barreira_talento', nome: 'Barreira', custo: 15, desc: 'Converte dano recebido em custo de mana.' },
  { key: '4v1', nome: '4v1', custo: 15, desc: 'Bônus de dano pela diferença numérica de inimigos.' },
  { key: 'ultrakill', nome: 'ULTRAKILL', custo: 15, desc: 'Acumula dano ao derrotar inimigos.' },
  { key: 'reforco_simples', nome: 'Reforço Corporal Simples', custo: 30, desc: 'Reduz dano recebido em troca de mana.' },
  { key: 'reforco_avancado', nome: 'Reforço Corporal Avançado', custo: 35, desc: 'Versão avançada do reforço corporal.' },
  { key: 'arma_mana', nome: 'Arma de Mana', custo: 15, desc: 'Cria arma de mana que escala com mana gasta.' },
  { key: 'duro_matar', nome: 'Duro de Matar', custo: 25, desc: 'Pode ignorar dano quase letal em uso raro.' },
  { key: 'coracao_mana', nome: 'Coração de Mana', custo: 30, desc: 'Regenera mana por rodada com risco alto.' },
  { key: 'forma_fantasmagorica', nome: 'Forma Fantasmagórica', custo: 25, desc: 'Intangibilidade por rodadas limitadas.' },
  { key: 'susanoo', nome: 'Com ou sem Susanoo', custo: 35, desc: 'Pode duplicar modificadores de dano em condição específica.' }
];

const $ = (id) => document.getElementById(id);
const $$ = (sel) => [...document.querySelectorAll(sel)];
const state = { customPericias: [] };

const session = HeroStore.getSession();
if (!session) window.location.href = 'login.html';
$('sessionUser').textContent = session.email;
if (session.role !== 'admin') $('adminLink').style.display = 'none';

$('btnLogout').addEventListener('click', () => {
  HeroStore.logout();
  window.location.href = 'login.html';
});

function mod(v) { return Math.floor((v - 10) / 2); }
function expNext(level) { return level * 100; }

function milestoneLevelsUntil(level) {
  const out = [];
  for (let i = 2; i <= level; i++) {
    if (i === 2 || i === 5 || (i > 5 && (i - 5) % 5 === 0) || (i > 2 && (i - 2) % 5 === 0)) out.push(i);
  }
  return [...new Set(out)].sort((a, b) => a - b);
}

function calcCombatEvolution(level) {
  let total = 15;
  for (const m of milestoneLevelsUntil(level)) {
    total += 5 + Math.floor(m / 10);
  }
  return total;
}

function calcAttributeGain(level) {
  let total = 0;
  for (let i = 2; i <= level; i++) total += 1 + Math.floor(i / 10);
  return total;
}

function allPericias() { return [...BASE_PERICIAS, ...state.customPericias]; }

function extractPesoTotal(texto) {
  const pesos = [...texto.matchAll(/peso\s*:\s*([0-9]+(?:[.,][0-9]+)?)/gi)];
  return pesos.reduce((sum, m) => sum + Number(m[1].replace(',', '.')), 0);
}

function renderOrigens() {
  $('origem').innerHTML = Object.entries(ORIGENS).map(([k, v]) => `<option value="${k}">${v.nome}</option>`).join('');
}

function renderCategorias() {
  const html = ['<option value="">Nenhuma</option>', ...CATEGORIAS.map((c) => `<option>${c}</option>`)].join('');
  $('categoriaPrincipal').innerHTML = CATEGORIAS.map((c) => `<option>${c}</option>`).join('');
  $('categoriaSec1').innerHTML = html;
  $('categoriaSec2').innerHTML = html;
}

function renderAttrGrid() {
  $('atributosGrid').innerHTML = ATTRS.map((a) => `
    <label>${a.nome}
      <input id="attr_${a.key}" type="number" min="8" max="20" value="10" />
      <small>Mod: <strong id="mod_${a.key}">0</strong></small>
    </label>
  `).join('');
}

function renderCostTable() {
  $('tabelaCusto').innerHTML = Object.entries(ATTR_COST).map(([attr, cost]) => `<span><strong>${attr}</strong> → ${cost}</span>`).join('');
}

function renderPericias() {
  $('periciasLista').innerHTML = allPericias().map((p) => `
    <label class="skill-item">
      <span><input type="checkbox" data-pericia="${p.nome}" /> ${p.nome}</span>
      <small class="muted">${p.desc}</small>
    </label>
  `).join('');
}

function renderCatalog(id, items, dataAttr) {
  $(id).innerHTML = items.map((item) => `
    <article class="catalog-item">
      <label>
        <span><input type="checkbox" data-${dataAttr}="${item.key}" /> <strong>${item.nome}</strong> <small>(${item.custo} pts)</small></span>
        <small class="muted">${item.desc}</small>
        ${item.categoria ? `<small class="muted">Categoria: ${item.categoria} • Ação: ${item.acao} • Alcance: ${item.alcance}</small>` : ''}
      </label>
    </article>
  `).join('');
}

function computeEfficiencyText() {
  const count = [$('categoriaSec1').value, $('categoriaSec2').value].filter(Boolean).length;
  if (count === 2) return { factor: 4, text: 'Eficiência secundária: 25% (custo x4).' };
  if (count === 1) return { factor: 2, text: 'Eficiência secundária: 50% (custo x2).' };
  return { factor: 1, text: 'Eficiência secundária: sem redução.' };
}

function recalc() {
  const level = Math.max(1, Number($('nivel').value || 1));
  const xp = Math.max(0, Number($('xpAtual').value || 0));

  $('nivelTexto').textContent = level;
  $('xpTexto').textContent = `${xp}/${expNext(level)}`;
  $('caTexto').textContent = Number($('ca').value || 10);

  const attrVals = {};
  let costUsed = 0;
  ATTRS.forEach((a) => {
    const v = Number($(`attr_${a.key}`).value || 10);
    attrVals[a.key] = v;
    $(`mod_${a.key}`).textContent = mod(v);
    costUsed += ATTR_COST[v] ?? 0;
  });

  const hp = level * 5 + attrVals.vigor * level;
  const mana = level * 5 + attrVals.poder * level;
  const pericias = Math.max(0, Math.floor(2 + attrVals.intelecto / 2));

  $('hpTotal').textContent = hp;
  $('manaTotal').textContent = mana;
  $('periciasTotal').textContent = pericias;

  $('hpBarText').textContent = `${Number($('vidaAtual').value || 0)}/${hp}`;
  $('manaBarText').textContent = `${Number($('manaAtual').value || 0)}/${mana}`;
  $('esforcoText').textContent = Math.max(1, Math.floor(level / 3));
  $('orb_forca').textContent = attrVals.forca;
  $('orb_destreza').textContent = attrVals.destreza;
  $('orb_vigor').textContent = attrVals.vigor;
  $('orb_intelecto').textContent = attrVals.intelecto;
  $('orb_poder').textContent = attrVals.poder;

  $('custoUsado').textContent = costUsed;
  const saldo = BASE_ATTR_BUDGET - costUsed;
  $('custoSaldo').textContent = saldo;
  $('custoSaldo').className = saldo < 0 ? 'bad' : 'good';

  const pa = calcAttributeGain(level);
  $('pontosAtributoNivel').textContent = pa;

  const pc = calcCombatEvolution(level);
  const pde = calcCombatEvolution(level);
  const originKey = $('origem').value;
  const pcBonus = originKey === 'vigilante' ? 10 : 0;
  const pdeBonus = originKey === 'vitima' ? 15 : 0;
  const pcTotal = pc + pcBonus + pdeBonus;
  const pdeTotal = pde + pdeBonus;
  $('pcTotal').textContent = pcTotal;
  $('pdeTotal').textContent = pdeTotal;
  const marcos = milestoneLevelsUntil(level);
  $('marcosTexto').textContent = marcos.length ? marcos.join(', ') : 'Nível 1';

  $('origemObs').textContent = ORIGENS[originKey]?.obs || '';

  const eff = computeEfficiencyText();
  $('poderEficiencia').textContent = eff.text;
  const pdeEfeitos = EFEITOS.reduce((sum, e) => sum + ($(`[data-efeito="${e.key}"]`)?.checked ? e.custo * eff.factor : 0), 0);
  $('pdeEfeitos').textContent = pdeEfeitos;

  const pcGasto = APTIDOES.reduce((sum, a) => sum + ($(`[data-aptidao="${a.key}"]`)?.checked ? a.custo : 0), 0)
    + TALENTOS.reduce((sum, t) => sum + ($(`[data-talento="${t.key}"]`)?.checked ? t.custo : 0), 0);
  $('pcGasto').textContent = pcGasto;
  $('pcSaldo').textContent = pcTotal - pcGasto;
  $('pcSaldo').className = pcTotal - pcGasto < 0 ? 'bad' : 'good';

  const pesoAtual = extractPesoTotal($('inventarioTexto').value);
  const pesoMax = (mod(attrVals.forca) + 5) * 3;
  $('pesoAtual').textContent = pesoAtual.toFixed(1);
  $('pesoMax').textContent = pesoMax;

  if (Number($('vidaAtual').value || 0) > hp) $('vidaAtual').value = hp;
  if (Number($('manaAtual').value || 0) > mana) $('manaAtual').value = mana;
}

function addPericia() {
  const nome = $('novaPericiaNome').value.trim();
  const desc = $('novaPericiaDesc').value.trim() || 'Perícia customizada.';
  if (!nome) return;
  if (allPericias().some((p) => p.nome.toLowerCase() === nome.toLowerCase())) {
    setFeedback('saveFeedback', 'Perícia já existe.', 'error');
    return;
  }
  state.customPericias.push({ nome, desc });
  $('novaPericiaNome').value = '';
  $('novaPericiaDesc').value = '';
  renderPericias();
  recalc();
}

function collectSheet() {
  return {
    metadata: {
      sheetId: $('sheetId').value.trim() || null,
      campanha: $('campanha').value.trim() || null,
      owner: session.email,
      updatedAt: new Date().toISOString()
    },
    personagem: {
      nome: $('nome').value,
      idade: Number($('idade').value || 18),
      codenome: $('codenome').value,
      rank: $('rank').value,
      turma: $('turma').value,
      origem: $('origem').value,
      nivel: Number($('nivel').value || 1),
      xpAtual: Number($('xpAtual').value || 0),
      vidaAtual: Number($('vidaAtual').value || 0),
      manaAtual: Number($('manaAtual').value || 0),
      ca: Number($('ca').value || 10),
      atributos: Object.fromEntries(ATTRS.map((a) => [a.key, Number($(`attr_${a.key}`).value || 10)])),
      periciasCustom: state.customPericias,
      periciasMarcadas: $$('[data-pericia]:checked').map((x) => x.dataset.pericia),
      oficios: [$('oficio1').value, $('oficio2').value, $('oficio3').value],
      aptidoesSelecionadas: $$('[data-aptidao]:checked').map((x) => x.dataset.aptidao),
      aptidoesNotas: $('aptidoesNotas').value,
      talentosSelecionados: $$('[data-talento]:checked').map((x) => x.dataset.talento),
      talentosNotas: $('talentosNotas').value,
      poder: {
        nome: $('poderNome').value,
        descricao: $('poderDescricao').value,
        defeito: $('poderDefeito').value,
        categoriaPrincipal: $('categoriaPrincipal').value,
        categoriaSec1: $('categoriaSec1').value,
        categoriaSec2: $('categoriaSec2').value,
        efeitosSelecionados: $$('[data-efeito]:checked').map((x) => x.dataset.efeito),
        resumo: $('poderResumo').value
      },
      inventarioTexto: $('inventarioTexto').value,
      cicatrizes: $('cicatrizes').value
    }
  };
}

function applySheet(payload) {
  const p = payload?.personagem;
  if (!p) return;

  $('nome').value = p.nome || '';
  $('idade').value = p.idade || 18;
  $('codenome').value = p.codenome || '';
  $('rank').value = p.rank || '';
  $('turma').value = p.turma || '';
  $('origem').value = p.origem || 'nenhuma';
  $('nivel').value = p.nivel || 1;
  $('xpAtual').value = p.xpAtual || 0;
  $('vidaAtual').value = p.vidaAtual || 0;
  $('manaAtual').value = p.manaAtual || 0;
  $('ca').value = p.ca || 10;

  ATTRS.forEach((a) => {
    if (typeof p.atributos?.[a.key] === 'number') $(`attr_${a.key}`).value = p.atributos[a.key];
  });

  state.customPericias = Array.isArray(p.periciasCustom) ? p.periciasCustom : [];
  renderPericias();
  $$('[data-pericia]').forEach((c) => { c.checked = p.periciasMarcadas?.includes(c.dataset.pericia) || false; });

  $('oficio1').value = p.oficios?.[0] || '';
  $('oficio2').value = p.oficios?.[1] || '';
  $('oficio3').value = p.oficios?.[2] || '';
  $$('[data-aptidao]').forEach((c) => { c.checked = p.aptidoesSelecionadas?.includes(c.dataset.aptidao) || false; });
  $$('[data-talento]').forEach((c) => { c.checked = p.talentosSelecionados?.includes(c.dataset.talento) || false; });
  $('aptidoesNotas').value = p.aptidoesNotas || '';
  $('talentosNotas').value = p.talentosNotas || '';

  $('poderNome').value = p.poder?.nome || '';
  $('poderDescricao').value = p.poder?.descricao || '';
  $('poderDefeito').value = p.poder?.defeito || '';
  $('categoriaPrincipal').value = p.poder?.categoriaPrincipal || 'Ataque';
  $('categoriaSec1').value = p.poder?.categoriaSec1 || '';
  $('categoriaSec2').value = p.poder?.categoriaSec2 || '';
  $$('[data-efeito]').forEach((c) => { c.checked = p.poder?.efeitosSelecionados?.includes(c.dataset.efeito) || false; });
  $('poderResumo').value = p.poder?.resumo || '';

  $('inventarioTexto').value = p.inventarioTexto || '';
  $('cicatrizes').value = p.cicatrizes || '';

  $('sheetId').value = payload.metadata?.sheetId || '';
  $('campanha').value = payload.metadata?.campanha || '';
  recalc();
}

function init() {
  renderOrigens();
  renderCategorias();
  renderAttrGrid();
  renderCostTable();
  renderPericias();
  renderCatalog('efeitosCatalogo', EFEITOS, 'efeito');
  renderCatalog('aptidoesCatalogo', APTIDOES, 'aptidao');
  renderCatalog('talentosCatalogo', TALENTOS, 'talento');

  $('btnAddPericia').addEventListener('click', addPericia);
  $('btnSalvar').addEventListener('click', () => {
    const ficha = collectSheet();
    const id = HeroStore.upsertSheet(session.email, ficha);
    $('sheetId').value = id;
    setFeedback('saveFeedback', `Ficha salva! ID: ${id}`, 'success');
  });

  $('btnCarregar').addEventListener('click', () => {
    const id = $('sheetId').value.trim();
    const ficha = HeroStore.getSheet(session.email, id);
    if (!ficha) return setFeedback('saveFeedback', 'Ficha não encontrada para este usuário.', 'error');
    applySheet(ficha);
    setFeedback('saveFeedback', 'Ficha carregada.', 'success');
  });

  $('btnExportar').addEventListener('click', () => {
    const data = collectSheet();
    exportJson(`${data.personagem.nome || 'ficha'}-hero.json`, data);
  });

  $('btnReset').addEventListener('click', () => window.location.reload());
  document.addEventListener('input', recalc);
  document.addEventListener('change', recalc);
  recalc();
}

init();
