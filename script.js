const ATTRS = [
  { key: 'forca', nome: 'Força' },
  { key: 'destreza', nome: 'Destreza' },
  { key: 'vigor', nome: 'Vigor' },
  { key: 'poder', nome: 'Poder' },
  { key: 'inteligencia', nome: 'Inteligência' },
  { key: 'agilidade', nome: 'Agilidade' }
];

const ATTRIBUTE_COST = { 8: -2, 9: -1, 10: 0, 11: 1, 12: 2, 13: 2, 14: 3, 15: 4, 16: 6, 17: 8, 18: 10, 19: 11, 20: 12 };

const ORIGENS = {
  nenhuma: { nome: 'Nenhuma', dinheiro: 250, deslocamento: 9, mods: {}, obs: '' },
  experimento: { nome: 'Experimento', dinheiro: 0, deslocamento: 9, mods: { poder: 4, forca: -2, vigor: -2 }, obs: 'Alternativa: -2 Agilidade e -2 Vigor no lugar de Força.' },
  favelado: { nome: 'Favelado', dinheiro: 50, deslocamento: 9, mods: { vigor: -4, destreza: 4 }, obs: 'Começa com duas armas simples.' },
  vigilante: { nome: 'Vigilante', dinheiro: 250, deslocamento: 9, mods: { forca: 6 }, obs: 'Alternativa: +6 Destreza e -2 em dois atributos à escolha.' },
  indispertado: { nome: 'Indispertado', dinheiro: 250, deslocamento: 9, mods: { poder: -10, forca: 10, destreza: 10, vigor: 10 }, obs: 'Ajuste manual conforme capítulo específico.' },
  ex_possuido: { nome: 'Ex-possuído', dinheiro: 250, deslocamento: 9, mods: { poder: 6, vigor: -4 }, obs: '' },
  amnesico: { nome: 'Amnésico', dinheiro: 250, deslocamento: 9, mods: { inteligencia: -2 }, obs: 'Escolha manualmente +4 em um atributo.' },
  nomade: { nome: 'Nômade', dinheiro: 250, deslocamento: 12, mods: { destreza: 2 }, obs: '+3m de deslocamento já aplicado.' },
  vitima: { nome: 'Vítima', dinheiro: 250, deslocamento: 9, mods: {}, obs: '+15 pontos de evolução e combate. Cicatriz física inicial.' },
  cacado: { nome: 'Caçado', dinheiro: 250, deslocamento: 9, mods: {}, obs: 'Treino marcial e XP dobrado em embates com o caçador.' }
};

const EFFECTS = [
  { key: 'dano', nome: 'Dano', custo: 7, categoria: 'Ataque/Mente', formula: 'ceil((rank/3) + (mana/10)*d6 + (mana/2) + poder)' },
  { key: 'criar', nome: 'Criar', custo: 10, categoria: 'Geral', formula: 'Peso máx = 15kg × rank' },
  { key: 'condicao', nome: 'Condição', custo: 15, categoria: 'Suporte', formula: 'Impõe condições debilitantes' },
  { key: 'paralisar', nome: 'Paralisar', custo: 8, categoria: 'Suporte', formula: 'Atordoar/desacelerar/enfraquecer' },
  { key: 'anular', nome: 'Anular', custo: 3, categoria: 'Mente', formula: 'Remove poder ativo' },
  { key: 'invocacao', nome: 'Invocação', custo: 5, categoria: 'Suporte', formula: 'Pontos criatura = rank*3 + mana' },
  { key: 'transformacao', nome: 'Transformação', custo: 25, categoria: 'Geral', formula: '+25% em 2 atributos ou +50% em 1' },
  { key: 'mover', nome: 'Mover Objeto', custo: 3, categoria: 'Mente', formula: 'Base 25kg/9m; +20kg/+1m por rank' },
  { key: 'teleporte', nome: 'Teleporte', custo: 25, categoria: 'Geral/Mente', formula: 'Distância base 18m × rank' },
  { key: 'barreira', nome: 'Barreira', custo: 5, categoria: 'Defesa', formula: 'HP barreira = mana gasta × (rank/2)' },
  { key: 'cura', nome: 'Cura', custo: 5, categoria: 'Suporte', formula: 'Cura = mana*2 + rank*4 (toque: mana*3 + rank*6)' },
  { key: 'comunicacao', nome: 'Comunicação', custo: 3, categoria: 'Mente', formula: 'Alcance por rank (3,9,27,50,100)' },
  { key: 'auto_trans', nome: 'Auto-transfiguração', custo: 7, categoria: 'Suporte', formula: 'Modificações corporais por rank' },
  { key: 'voo', nome: 'Voo', custo: 15, categoria: 'Geral', formula: 'Velocidade = deslocamento × rank' }
];

const APTIDOES = [
  { nome: 'Acerto Crítico Aprimorado', custo: 5 },
  { nome: 'Agarrar Aprimorado', custo: 2 },
  { nome: 'Ataque Atordoante', custo: 5 },
  { nome: 'Ataque Duplo', custo: 12 },
  { nome: 'Ataque Triplo', custo: 25 },
  { nome: 'Ataque Giratório', custo: 3 },
  { nome: 'Ataque Poderoso', custo: 3 },
  { nome: 'Combater com Duas Armas', custo: 15 },
  { nome: 'Contra-ataque Rápido', custo: 3 },
  { nome: 'Precisão Letal', custo: 8 },
  { nome: 'Leitura de Combate', custo: 4 },
  { nome: 'Golpe Explosivo', custo: 8 },
  { nome: 'Passo Fantasma', custo: 4 },
  { nome: 'Impacto de Choque', custo: 5 },
  { nome: 'Recuperar Fôlego', custo: 10 },
  { nome: 'Reflexo de Combate', custo: 3 },
  { nome: 'Movimento Serpenteante', custo: 4 },
  { nome: 'Foco', custo: 8 },
  { nome: 'Iniciativa Aprimorada', custo: 6 },
  { nome: 'Bloqueio Melhorado', custo: 3 },
  { nome: 'Execução', custo: 8 },
  { nome: 'Barreira (Talento)', custo: 15 },
  { nome: 'Arma de Mana', custo: 15 },
  { nome: 'Duro de Matar', custo: 25 },
  { nome: 'Forma Fantasmagórica', custo: 25 }
];

const $ = (id) => document.getElementById(id);
const $$ = (s) => [...document.querySelectorAll(s)];

let userSession = { mode: 'local', email: null, token: null };

function mod(v) { return Math.floor((v - 10) / 2); }
function expParaProximoNivel(nivel) { return nivel * 100; }

function ganhosAtributoPorNivel(nivel) {
  let total = 0;
  for (let l = 2; l <= nivel; l++) total += 1 + Math.floor(l / 10);
  return total;
}

function ganhosCombateEvolucao(nivel) {
  let total = 15;
  for (let l = 2; l <= nivel; l++) if (l % 5 === 0 || l % 5 === 2) total += 5 + Math.floor(l / 10);
  return total;
}

function setFeedback(id, msg, type = '') {
  const el = $(id);
  el.textContent = msg;
  el.className = `feedback ${type}`.trim();
}

function montarOrigens() {
  $('origem').innerHTML = Object.entries(ORIGENS)
    .map(([k, o]) => `<option value="${k}">${o.nome}</option>`)
    .join('');
}

function montarTabelaCusto() {
  $('costTableBody').innerHTML = Object.entries(ATTRIBUTE_COST)
    .map(([attr, custo]) => `<tr><td>${attr}</td><td>${custo}</td></tr>`)
    .join('');
}

function montarAtributos() {
  $('atributosGrid').innerHTML = ATTRS.map(({ key, nome }) => `
    <label>${nome}
      <input type="number" id="attr_${key}" min="8" max="20" value="10" />
      <small>Modificador: <strong id="mod_${key}">0</strong></small>
    </label>
  `).join('');
}

function montarEfeitos() {
  $('effectsGrid').innerHTML = EFFECTS.map((e) => `
    <article class="effect-item">
      <label><input type="checkbox" id="effect_${e.key}" /> <strong>${e.nome}</strong> (${e.custo} PdE)</label>
      <small class="muted">Categoria: ${e.categoria}</small>
      <p class="muted">${e.formula}</p>
      <div class="inline">
        <label>Rank<input type="number" id="rank_${e.key}" min="1" value="1"></label>
        <label>Mana<input type="number" id="mana_${e.key}" min="0" value="0"></label>
      </div>
      <small>Gasto mín. de mana: <strong id="manaMin_${e.key}">${e.custo}</strong></small>
    </article>
  `).join('');
}

function montarAptidoes() {
  renderAptidoes('');
}

function renderAptidoes(filtro) {
  const term = (filtro || '').toLowerCase().trim();
  const list = APTIDOES.filter((a) => a.nome.toLowerCase().includes(term));
  $('aptidoesLista').innerHTML = list.map((a, idx) => `
    <label class="apt-item">
      <span><input type="checkbox" data-apt="${a.nome}"> ${a.nome}</span>
      <small>${a.custo} PC</small>
    </label>`).join('') || '<small class="muted">Nenhuma aptidão encontrada.</small>';
}

function aplicarOrigem(valorBase, attrKey) {
  const origem = ORIGENS[$('origem').value] || ORIGENS.nenhuma;
  return valorBase + (origem.mods[attrKey] || 0);
}

function calcularEfeitosSelecionados() {
  let pdeGasto = 0;
  EFFECTS.forEach((e) => {
    const marcado = $(`effect_${e.key}`)?.checked;
    if (marcado) pdeGasto += e.custo;

    const mana = Number($(`mana_${e.key}`)?.value || 0);
    const min = Math.max(e.custo, mana);
    $(`manaMin_${e.key}`).textContent = min;
  });
  return pdeGasto;
}

function calcularAptidoesSelecionadas(pontosCombateTotal) {
  let gasto = 0;
  $$('[data-apt]:checked').forEach((check) => {
    const item = APTIDOES.find((a) => a.nome === check.getAttribute('data-apt'));
    if (item) gasto += item.custo;
  });

  $('pcGastos').textContent = gasto;
  const saldo = pontosCombateTotal - gasto;
  $('pcSaldo').textContent = saldo;
  $('pcSaldo').className = saldo < 0 ? 'bad' : 'good';
}

function calcularTudo() {
  const nivel = Math.max(1, Number($('nivel').value || 1));
  $('expProximo').textContent = expParaProximoNivel(nivel);

  let custoUsado = 0;
  const attrsFinal = {};

  for (const a of ATTRS) {
    const base = Number($(`attr_${a.key}`).value || 10);
    const custo = ATTRIBUTE_COST[base] ?? 0;
    custoUsado += custo;

    const valorFinal = aplicarOrigem(base, a.key);
    attrsFinal[a.key] = valorFinal;
    $(`mod_${a.key}`).textContent = mod(valorFinal);
  }

  const restante = 28 - custoUsado;
  $('custoUsado').textContent = custoUsado;
  $('custoRestante').textContent = restante;
  $('custoRestante').className = restante < 0 ? 'bad' : 'good';

  const origem = ORIGENS[$('origem').value] || ORIGENS.nenhuma;
  $('dinheiro').textContent = `$${origem.dinheiro}`;
  $('deslocamento').textContent = `${origem.deslocamento}m`;
  $('origemObs').textContent = origem.obs || 'Sem observações de origem.';

  const mana = nivel * 5 + attrsFinal.poder * nivel;
  const hp = nivel * 5 + attrsFinal.vigor * nivel;
  const pericias = Math.max(0, Math.floor(2 + attrsFinal.inteligencia / 2));

  $('manaTotal').textContent = mana;
  $('hpTotal').textContent = hp;
  $('periciasTotal').textContent = pericias;
  $('modPoder').textContent = mod(attrsFinal.poder);

  const baseCE = ganhosCombateEvolucao(nivel);
  const bonusVitima = $('origem').value === 'vitima' ? 15 : 0;
  const bonusVigilante = $('origem').value === 'vigilante' ? 10 : 0;

  const pontosCombate = baseCE + bonusVitima + bonusVigilante;
  const pontosEvolucao = baseCE + bonusVitima;

  $('pontosCombate').textContent = pontosCombate;
  $('pontosEvolucao').textContent = pontosEvolucao;
  $('pontosAtributoNivel').textContent = ganhosAtributoPorNivel(nivel);

  const sec1 = $('categoriaSec1').value;
  const sec2 = $('categoriaSec2').value;
  let ef = 'Sem categorias secundárias.';
  if (sec1 && !sec2) ef = '1 secundária: 50% de eficiência (custo x2).';
  if (sec1 && sec2) ef = '2 secundárias: 25% de eficiência (custo x4).';
  $('eficienciaTexto').textContent = ef;

  const pdeEfeitos = calcularEfeitosSelecionados();
  const pdeSaldo = pontosEvolucao - pdeEfeitos;
  $('saveFeedback').textContent = `PdE em efeitos: ${pdeEfeitos} | Saldo PdE: ${pdeSaldo}`;
  $('saveFeedback').className = `feedback ${pdeSaldo < 0 ? 'error' : ''}`.trim();

  calcularAptidoesSelecionadas(pontosCombate);
}

function coletarFicha() {
  const atributos = Object.fromEntries(ATTRS.map((a) => [a.key, Number($(`attr_${a.key}`).value || 10)]));

  const efeitosSelecionados = EFFECTS.filter((e) => $(`effect_${e.key}`)?.checked).map((e) => ({
    nome: e.nome,
    custo: e.custo,
    rank: Number($(`rank_${e.key}`).value || 1),
    mana: Number($(`mana_${e.key}`).value || 0)
  }));

  const aptidoesSelecionadas = $$('[data-apt]:checked').map((c) => c.getAttribute('data-apt'));

  return {
    metadata: {
      sheetId: $('sheetId').value.trim() || null,
      campanha: $('campanha').value.trim() || null,
      atualizadoEm: new Date().toISOString(),
      usuario: userSession.email || 'visitante'
    },
    personagem: {
      nome: $('nome').value,
      origem: $('origem').value,
      nivel: Number($('nivel').value || 1),
      expAtual: Number($('expAtual').value || 0),
      atributos,
      poder: {
        descricao: $('poderDescricao').value,
        defeito: $('poderDefeito').value,
        categoriaPrincipal: $('categoriaPrincipal').value,
        categoriaSec1: $('categoriaSec1').value,
        categoriaSec2: $('categoriaSec2').value
      },
      aptidoesSelecionadas,
      aptidoesNotas: $('aptidoes').value,
      efeitosSelecionados
    }
  };
}

function preencherFicha(payload) {
  if (!payload?.personagem) return;
  const p = payload.personagem;
  $('nome').value = p.nome || '';
  $('origem').value = p.origem || 'nenhuma';
  $('nivel').value = p.nivel || 1;
  $('expAtual').value = p.expAtual || 0;

  ATTRS.forEach((a) => {
    const v = p.atributos?.[a.key];
    if (typeof v === 'number') $(`attr_${a.key}`).value = v;
  });

  $('poderDescricao').value = p.poder?.descricao || '';
  $('poderDefeito').value = p.poder?.defeito || '';
  $('categoriaPrincipal').value = p.poder?.categoriaPrincipal || 'Ataque';
  $('categoriaSec1').value = p.poder?.categoriaSec1 || '';
  $('categoriaSec2').value = p.poder?.categoriaSec2 || '';
  $('aptidoes').value = p.aptidoesNotas || '';

  $$('[data-apt]').forEach((c) => { c.checked = false; });
  (p.aptidoesSelecionadas || []).forEach((nome) => {
    const check = $$('[data-apt]').find((c) => c.getAttribute('data-apt') === nome);
    if (check) check.checked = true;
  });

  EFFECTS.forEach((e) => {
    $(`effect_${e.key}`).checked = false;
    $(`rank_${e.key}`).value = 1;
    $(`mana_${e.key}`).value = 0;
  });
  (p.efeitosSelecionados || []).forEach((e) => {
    const cfg = EFFECTS.find((x) => x.nome === e.nome);
    if (!cfg) return;
    $(`effect_${cfg.key}`).checked = true;
    $(`rank_${cfg.key}`).value = e.rank || 1;
    $(`mana_${cfg.key}`).value = e.mana || 0;
  });

  $('sheetId').value = payload.metadata?.sheetId || $('sheetId').value;
  $('campanha').value = payload.metadata?.campanha || $('campanha').value;

  calcularTudo();
}

function downloadJson(filename, payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function exportarJSON() {
  const ficha = coletarFicha();
  const filename = `${ficha.personagem.nome || 'ficha'}-hero.json`;
  downloadJson(filename, ficha);
}

function resetar() {
  document.querySelectorAll('input, textarea').forEach((el) => {
    if (el.type === 'number') {
      el.value = el.id === 'nivel' ? 1 : (el.id.startsWith('attr_') ? 10 : 0);
    } else if (el.type === 'checkbox') {
      el.checked = false;
    } else {
      el.value = '';
    }
  });
  document.querySelectorAll('select').forEach((s) => { s.selectedIndex = 0; });
  $('sheetId').value = '';
  $('campanha').value = '';
  calcularTudo();
}

function getLocalUsers() {
  return JSON.parse(localStorage.getItem('hero_users') || '{}');
}

function setLocalUsers(users) {
  localStorage.setItem('hero_users', JSON.stringify(users));
}

function setSession(email) {
  userSession.email = email;
  localStorage.setItem('hero_session', JSON.stringify(userSession));
  $('usuarioLogado').textContent = email || 'visitante';
}

function carregarSessao() {
  const stored = JSON.parse(localStorage.getItem('hero_session') || 'null');
  if (stored) userSession = { ...userSession, ...stored };
  $('usuarioLogado').textContent = userSession.email || 'visitante';

  $('apiBaseUrl').value = localStorage.getItem('hero_api_base_url') || '';
  $('apiToken').value = localStorage.getItem('hero_api_token') || '';
  if ($('apiToken').value) userSession.token = $('apiToken').value;
}

function registrarLocal() {
  const email = $('authEmail').value.trim().toLowerCase();
  const senha = $('authSenha').value;
  if (!email || senha.length < 4) return setFeedback('authFeedback', 'Informe e-mail válido e senha com 4+ caracteres.', 'error');

  const users = getLocalUsers();
  if (users[email]) return setFeedback('authFeedback', 'Este e-mail já está cadastrado.', 'error');

  users[email] = { senha };
  setLocalUsers(users);
  setSession(email);
  setFeedback('authFeedback', 'Conta criada com sucesso (modo local).', 'success');
}

function loginLocal() {
  const email = $('authEmail').value.trim().toLowerCase();
  const senha = $('authSenha').value;
  const users = getLocalUsers();

  if (!users[email] || users[email].senha !== senha) {
    return setFeedback('authFeedback', 'Credenciais inválidas no modo local.', 'error');
  }

  setSession(email);
  setFeedback('authFeedback', 'Login realizado com sucesso.', 'success');
}

function logout() {
  setSession(null);
  userSession.token = null;
  localStorage.removeItem('hero_api_token');
  $('apiToken').value = '';
  setFeedback('authFeedback', 'Sessão encerrada.', '');
  setStatusOnline(false);
}

function setStatusOnline(on) {
  const el = $('statusOnline');
  el.textContent = on ? 'online' : 'offline';
  el.className = `badge ${on ? 'online' : 'offline'}`;
}

function salvarConfigApi() {
  const base = $('apiBaseUrl').value.trim();
  const token = $('apiToken').value.trim();
  localStorage.setItem('hero_api_base_url', base);
  localStorage.setItem('hero_api_token', token);
  userSession.token = token || null;
  setFeedback('authFeedback', 'Configuração de API salva.', 'success');
}

async function testarApi() {
  try {
    const base = $('apiBaseUrl').value.trim();
    if (!base) throw new Error('Informe a Base URL primeiro.');

    const res = await fetch(`${base}/health`);
    if (!res.ok) throw new Error(`Falha no health (${res.status})`);

    setStatusOnline(true);
    setFeedback('authFeedback', 'API respondeu corretamente.', 'success');
  } catch (err) {
    setStatusOnline(false);
    setFeedback('authFeedback', `Erro ao testar API: ${err.message}`, 'error');
  }
}

function salvarFichaLocal(payload) {
  const email = userSession.email;
  if (!email) throw new Error('Faça login para salvar localmente.');

  const id = payload.metadata.sheetId || `${email}-${Date.now()}`;
  payload.metadata.sheetId = id;

  const bucketKey = `hero_sheets_${email}`;
  const bucket = JSON.parse(localStorage.getItem(bucketKey) || '{}');
  bucket[id] = payload;
  localStorage.setItem(bucketKey, JSON.stringify(bucket));
  return id;
}

function carregarFichaLocal(sheetId) {
  const email = userSession.email;
  if (!email) throw new Error('Faça login para carregar ficha local.');
  if (!sheetId) throw new Error('Informe o ID da ficha.');

  const bucketKey = `hero_sheets_${email}`;
  const bucket = JSON.parse(localStorage.getItem(bucketKey) || '{}');
  return bucket[sheetId] || null;
}

async function salvarFichaApi(payload) {
  const base = $('apiBaseUrl').value.trim();
  if (!base) throw new Error('Base URL da API não definida.');

  const res = await fetch(`${base}/sheets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(userSession.token ? { Authorization: `Bearer ${userSession.token}` } : {})
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erro ${res.status}: ${text || 'falha ao salvar'}`);
  }
  return res.json();
}

async function carregarFichaApi(sheetId) {
  const base = $('apiBaseUrl').value.trim();
  if (!base) throw new Error('Base URL da API não definida.');
  if (!sheetId) throw new Error('Informe o ID da ficha.');

  const res = await fetch(`${base}/sheets/${encodeURIComponent(sheetId)}`, {
    headers: {
      ...(userSession.token ? { Authorization: `Bearer ${userSession.token}` } : {})
    }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erro ${res.status}: ${text || 'falha ao carregar'}`);
  }

  return res.json();
}

async function salvarNuvem() {
  try {
    const payload = coletarFicha();
    let id;

    if (userSession.mode === 'local') {
      id = salvarFichaLocal(payload);
    } else {
      const response = await salvarFichaApi(payload);
      id = response.sheetId || response.id || payload.metadata.sheetId;
    }

    $('sheetId').value = id || $('sheetId').value;
    setFeedback('saveFeedback', `Ficha salva com sucesso. ID: ${$('sheetId').value}`, 'success');
  } catch (err) {
    setFeedback('saveFeedback', `Não foi possível salvar: ${err.message}`, 'error');
  }
}

async function carregarNuvem() {
  try {
    const id = $('sheetId').value.trim();
    let payload;

    if (userSession.mode === 'local') {
      payload = carregarFichaLocal(id);
      if (!payload) throw new Error('Ficha não encontrada nesse usuário.');
    } else {
      payload = await carregarFichaApi(id);
    }

    preencherFicha(payload);
    setFeedback('saveFeedback', 'Ficha carregada com sucesso.', 'success');
  } catch (err) {
    setFeedback('saveFeedback', `Não foi possível carregar: ${err.message}`, 'error');
  }
}

function bindTabs() {
  $$('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      $$('.tab-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const tab = btn.dataset.tab;
      $$('.tab-content').forEach((c) => c.classList.remove('active'));
      $(`tab-${tab}`)?.classList.add('active');

      userSession.mode = tab;
      localStorage.setItem('hero_session', JSON.stringify(userSession));
      setStatusOnline(tab === 'api' && Boolean($('apiToken').value));
    });
  });
}

function init() {
  montarOrigens();
  montarTabelaCusto();
  montarAtributos();
  montarEfeitos();
  montarAptidoes();
  carregarSessao();
  bindTabs();

  document.addEventListener('input', calcularTudo);
  document.addEventListener('change', calcularTudo);

  $('aptidaoBusca').addEventListener('input', (e) => renderAptidoes(e.target.value));

  $('btnRegistrar').addEventListener('click', registrarLocal);
  $('btnLogin').addEventListener('click', loginLocal);
  $('btnLogout').addEventListener('click', logout);

  $('btnSalvarConfigApi').addEventListener('click', salvarConfigApi);
  $('btnTestarApi').addEventListener('click', testarApi);

  $('btnSalvarNuvem').addEventListener('click', salvarNuvem);
  $('btnCarregarNuvem').addEventListener('click', carregarNuvem);
  $('exportar').addEventListener('click', exportarJSON);
  $('resetar').addEventListener('click', resetar);

  calcularTudo();
}

init();
