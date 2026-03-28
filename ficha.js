const ATTRS = [
  { key: 'forca', nome: 'Força' },
  { key: 'destreza', nome: 'Destreza' },
  { key: 'vigor', nome: 'Vigor' },
  { key: 'poder', nome: 'Poder' },
  { key: 'inteligencia', nome: 'Inteligência' },
  { key: 'agilidade', nome: 'Agilidade' }
];

const ORIGENS = {
  nenhuma: { nome: 'Nenhuma', dinheiro: 250, mods: {}, obs: '' },
  experimento: { nome: 'Experimento', dinheiro: 0, mods: { poder: 4, forca: -2, vigor: -2 }, obs: 'Alternativa: -2 agilidade e -2 vigor.' },
  favelado: { nome: 'Favelado', dinheiro: 50, mods: { vigor: -4, destreza: 4 }, obs: 'Começa com duas armas simples.' },
  vigilante: { nome: 'Vigilante', dinheiro: 250, mods: { forca: 6 }, obs: '+10 pontos de combate extras.' },
  indispertado: { nome: 'Indispertado', dinheiro: 250, mods: { poder: -10, forca: 10, destreza: 10, vigor: 10 }, obs: 'Ajustes manuais podem ser necessários.' },
  ex_possuido: { nome: 'Ex-possuído', dinheiro: 250, mods: { poder: 6, vigor: -4 }, obs: '' },
  amnesico: { nome: 'Amnésico', dinheiro: 250, mods: { inteligencia: -2 }, obs: 'Escolha +4 em um atributo manualmente.' },
  nomade: { nome: 'Nômade', dinheiro: 250, mods: { destreza: 2 }, obs: '' },
  vitima: { nome: 'Vítima', dinheiro: 250, mods: {}, obs: '+15 combate e +15 evolução.' },
  cacado: { nome: 'Caçado', dinheiro: 250, mods: {}, obs: '' }
};

const COST = { 8: -2, 9: -1, 10: 0, 11: 1, 12: 2, 13: 2, 14: 3, 15: 4, 16: 6, 17: 8, 18: 10, 19: 11, 20: 12 };

const EFFECTS = [
  { key: 'dano', nome: 'Dano', custo: 7 },
  { key: 'criar', nome: 'Criar', custo: 10 },
  { key: 'condicao', nome: 'Condição', custo: 15 },
  { key: 'anular', nome: 'Anular', custo: 3 },
  { key: 'invocacao', nome: 'Invocação', custo: 5 },
  { key: 'transformacao', nome: 'Transformação', custo: 25 },
  { key: 'teleporte', nome: 'Teleporte', custo: 25 },
  { key: 'barreira', nome: 'Barreira', custo: 5 },
  { key: 'cura', nome: 'Cura', custo: 5 },
  { key: 'voo', nome: 'Voo', custo: 15 }
];

const APTIDOES = [
  ['Acerto Crítico Aprimorado', 5], ['Ataque Duplo', 12], ['Ataque Triplo', 25], ['Ataque Poderoso', 3],
  ['Combater com Duas Armas', 15], ['Passo Fantasma', 4], ['Precisão Letal', 8], ['Foco', 8],
  ['Bloqueio Melhorado', 3], ['Duro de Matar', 25], ['Arma de Mana', 15]
].map(([nome, custo]) => ({ nome, custo }));

const $ = (id) => document.getElementById(id);
const $$ = (sel) => [...document.querySelectorAll(sel)];

const session = HeroStore.getSession();
if (!session) window.location.href = 'login.html';

$('sessionUser').textContent = session.email;
if (session.role !== 'admin') $('adminLink').style.display = 'none';

document.getElementById('btnLogout').addEventListener('click', () => {
  HeroStore.logout();
  window.location.href = 'login.html';
});

function mod(v) { return Math.floor((v - 10) / 2); }
function expNext(n) { return n * 100; }
function ganhoCE(n) { let t = 15; for (let i = 2; i <= n; i++) if (i % 5 === 0 || i % 5 === 2) t += 5 + Math.floor(i / 10); return t; }

function initUI() {
  $('origem').innerHTML = Object.entries(ORIGENS).map(([k, o]) => `<option value="${k}">${o.nome}</option>`).join('');
  $('atributosGrid').innerHTML = ATTRS.map((a) => `<label>${a.nome}<input id="attr_${a.key}" type="number" min="8" max="20" value="10" /><small>Mod: <strong id="mod_${a.key}">0</strong></small></label>`).join('');
  $('effectsGrid').innerHTML = EFFECTS.map((e) => `<label class="effect-item"><span><input data-effect="${e.key}" type="checkbox" /> ${e.nome}</span><small>${e.custo} PdE</small></label>`).join('');
  renderAptidoes('');
}

function renderAptidoes(term) {
  const t = term.toLowerCase();
  $('aptidoesLista').innerHTML = APTIDOES.filter((a) => a.nome.toLowerCase().includes(t)).map((a) => `
    <label class="apt-item"><span><input data-apt="${a.nome}" type="checkbox" /> ${a.nome}</span><small>${a.custo} PC</small></label>
  `).join('');
}

function calcular() {
  const nivel = Math.max(1, Number($('nivel').value || 1));
  $('expProximo').textContent = expNext(nivel);

  let custo = 0;
  const at = {};
  ATTRS.forEach((a) => {
    const base = Number($(`attr_${a.key}`).value || 10);
    custo += COST[base] ?? 0;
    at[a.key] = base + (ORIGENS[$('origem').value].mods[a.key] || 0);
    $(`mod_${a.key}`).textContent = mod(at[a.key]);
  });

  $('custoUsado').textContent = custo;
  const rem = 28 - custo;
  $('custoRestante').textContent = rem;
  $('custoRestante').className = rem < 0 ? 'bad' : 'good';

  const origem = ORIGENS[$('origem').value];
  $('dinheiro').textContent = `$${origem.dinheiro}`;
  $('origemObs').textContent = origem.obs || 'Sem observações.';

  $('manaTotal').textContent = nivel * 5 + at.poder * nivel;
  $('hpTotal').textContent = nivel * 5 + at.vigor * nivel;
  $('periciasTotal').textContent = Math.max(0, Math.floor(2 + at.inteligencia / 2));
  $('modPoder').textContent = mod(at.poder);

  const base = ganhoCE(nivel);
  const pc = base + ($('origem').value === 'vigilante' ? 10 : 0) + ($('origem').value === 'vitima' ? 15 : 0);
  const pe = base + ($('origem').value === 'vitima' ? 15 : 0);
  $('pontosCombate').textContent = pc;
  $('pontosEvolucao').textContent = pe;

  const sec1 = $('categoriaSec1').value;
  const sec2 = $('categoriaSec2').value;
  $('eficienciaTexto').textContent = sec1 && sec2 ? '2 secundárias: 25% (x4)' : sec1 ? '1 secundária: 50% (x2)' : 'Sem secundárias.';

  const pdeGasto = EFFECTS.reduce((sum, e) => sum + ($(`[data-effect="${e.key}"]`)?.checked ? e.custo : 0), 0);
  $('pdeGasto').textContent = pdeGasto;
  const pdeSaldo = pe - pdeGasto;
  $('pdeSaldo').textContent = pdeSaldo;
  $('pdeSaldo').className = pdeSaldo < 0 ? 'bad' : 'good';

  let pcGasto = 0;
  $$('[data-apt]:checked').forEach((c) => {
    const it = APTIDOES.find((a) => a.nome === c.dataset.apt);
    if (it) pcGasto += it.custo;
  });
  $('pcGasto').textContent = pcGasto;
  const pcSaldo = pc - pcGasto;
  $('pcSaldo').textContent = pcSaldo;
  $('pcSaldo').className = pcSaldo < 0 ? 'bad' : 'good';
}

function coletarFicha() {
  return {
    metadata: {
      sheetId: $('sheetId').value.trim() || null,
      campanha: $('campanha').value.trim() || null,
      owner: session.email,
      updatedAt: new Date().toISOString()
    },
    personagem: {
      nome: $('nome').value,
      origem: $('origem').value,
      nivel: Number($('nivel').value || 1),
      expAtual: Number($('expAtual').value || 0),
      atributos: Object.fromEntries(ATTRS.map((a) => [a.key, Number($(`attr_${a.key}`).value || 10)])),
      poder: {
        descricao: $('poderDescricao').value,
        defeito: $('poderDefeito').value,
        categoriaPrincipal: $('categoriaPrincipal').value,
        categoriaSec1: $('categoriaSec1').value,
        categoriaSec2: $('categoriaSec2').value
      },
      aptidoes: $$('[data-apt]:checked').map((x) => x.dataset.apt),
      aptidoesNotas: $('aptidoes').value,
      efeitos: EFFECTS.filter((e) => $(`[data-effect="${e.key}"]`)?.checked).map((e) => e.key)
    }
  };
}

function aplicarFicha(payload) {
  const p = payload?.personagem;
  if (!p) return;
  $('nome').value = p.nome || '';
  $('origem').value = p.origem || 'nenhuma';
  $('nivel').value = p.nivel || 1;
  $('expAtual').value = p.expAtual || 0;
  ATTRS.forEach((a) => { if (typeof p.atributos?.[a.key] === 'number') $(`attr_${a.key}`).value = p.atributos[a.key]; });
  $('poderDescricao').value = p.poder?.descricao || '';
  $('poderDefeito').value = p.poder?.defeito || '';
  $('categoriaPrincipal').value = p.poder?.categoriaPrincipal || 'Ataque';
  $('categoriaSec1').value = p.poder?.categoriaSec1 || '';
  $('categoriaSec2').value = p.poder?.categoriaSec2 || '';
  $('aptidoes').value = p.aptidoesNotas || '';

  $$('[data-apt]').forEach((c) => { c.checked = p.aptidoes?.includes(c.dataset.apt); });
  $$('[data-effect]').forEach((c) => { c.checked = p.efeitos?.includes(c.dataset.effect); });

  $('sheetId').value = payload.metadata?.sheetId || '';
  $('campanha').value = payload.metadata?.campanha || '';
  calcular();
}

$('btnSalvar').addEventListener('click', () => {
  const ficha = coletarFicha();
  const id = HeroStore.upsertSheet(session.email, ficha);
  $('sheetId').value = id;
  setFeedback('saveFeedback', `Ficha salva! ID: ${id}`, 'success');
});

$('btnCarregar').addEventListener('click', () => {
  const id = $('sheetId').value.trim();
  const ficha = HeroStore.getSheet(session.email, id);
  if (!ficha) return setFeedback('saveFeedback', 'Ficha não encontrada para este usuário.', 'error');
  aplicarFicha(ficha);
  setFeedback('saveFeedback', 'Ficha carregada.', 'success');
});

$('btnExportar').addEventListener('click', () => {
  const data = coletarFicha();
  exportJson(`${data.personagem.nome || 'ficha'}-hero.json`, data);
});

$('btnReset').addEventListener('click', () => window.location.reload());

document.addEventListener('input', calcular);
document.addEventListener('change', calcular);
$('aptidaoBusca').addEventListener('input', (e) => renderAptidoes(e.target.value));

initUI();
calcular();
