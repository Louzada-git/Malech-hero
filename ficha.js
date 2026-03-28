const ATTRS = [
  { key: 'forca', nome: 'Força' },
  { key: 'destreza', nome: 'Destreza' },
  { key: 'vigor', nome: 'Vigor' },
  { key: 'intelecto', nome: 'Intelecto' },
  { key: 'poder', nome: 'Poder' }
];

const COST = { 8: -2, 9: -1, 10: 0, 11: 1, 12: 2, 13: 2, 14: 3, 15: 4, 16: 6, 17: 8, 18: 10, 19: 11, 20: 12 };
const BUDGET = 28;

const ORIGENS = {
  nenhuma: { nome: 'Nenhuma', obs: 'Sem ajustes automáticos.' },
  experimento: { nome: 'Experimento', obs: '+4 Poder, penalidades físicas (ajuste manual).' },
  favelado: { nome: 'Favelado', obs: '+4 Destreza, -4 Vigor.' },
  vigilante: { nome: 'Vigilante', obs: '+10 pontos de combate.' },
  vitima: { nome: 'Vítima', obs: '+15 combate e +15 evolução.' }
};

const CATS = ['Ataque', 'Mente', 'Suporte', 'Defesa', 'Geral'];

const EFEITOS = [
  { key: 'dano', nome: 'Dano', custo: 7, desc: 'Dano direto. Fórmula depende de rank, mana e poder.' },
  { key: 'criar', nome: 'Criar', custo: 10, desc: 'Cria objetos físicos e evolui com rank.' },
  { key: 'condicao', nome: 'Condição', custo: 15, desc: 'Aplica condições debilitantes em alvo.' },
  { key: 'paralisar', nome: 'Paralisar', custo: 8, desc: 'Paralisa ou reduz atributos do alvo.' },
  { key: 'anular', nome: 'Anular', custo: 3, desc: 'Cancela poder ativo em cena.' },
  { key: 'invocacao', nome: 'Invocação', custo: 5, desc: 'Invoca criatura aliada baseada em rank e mana.' },
  { key: 'transformacao', nome: 'Transformação', custo: 25, desc: 'Melhora atributos temporariamente.' },
  { key: 'teleporte', nome: 'Teleporte', custo: 25, desc: 'Movimento instantâneo por distância de rank.' },
  { key: 'barreira', nome: 'Barreira', custo: 5, desc: 'Gera barreira defensiva.' },
  { key: 'cura', nome: 'Cura', custo: 5, desc: 'Recupera HP por fórmula de mana e rank.' },
  { key: 'voo', nome: 'Voo', custo: 15, desc: 'Concede deslocamento aéreo.' }
];

const APTIDOES = [
  { key: 'acerto_critico', nome: 'Acerto Crítico Aprimorado', custo: 5, desc: 'Aumenta margem de crítico.' },
  { key: 'ataque_duplo', nome: 'Ataque Duplo', custo: 12, desc: 'Executa dois ataques.' },
  { key: 'ataque_triplo', nome: 'Ataque Triplo', custo: 25, desc: 'Executa três ataques.' },
  { key: 'ataque_poderoso', nome: 'Ataque Poderoso', custo: 3, desc: 'Troca precisão por dano.' },
  { key: 'passo_fantasma', nome: 'Passo Fantasma', custo: 4, desc: 'Reposicionamento curto após atacar.' }
];

const TALENTOS = [
  { key: 'barreira', nome: 'Barreira', custo: 15, desc: 'Converte dano em gasto de mana.' },
  { key: 'ultrakill', nome: 'ULTRAKILL', custo: 15, desc: 'Bônus por inimigos derrotados.' },
  { key: 'arma_mana', nome: 'Arma de Mana', custo: 15, desc: 'Cria arma de mana.' },
  { key: 'duro_matar', nome: 'Duro de Matar', custo: 25, desc: 'Pode ignorar dano letal 1x.' }
];

const BASE_PERICIAS = [
  'Atletismo', 'Acrobacia', 'Furtividade', 'Reflexos', 'Crime', 'História', 'Investigação',
  'Natureza', 'Religião', 'Intuição', 'Medicina', 'Percepção', 'Sobrevivência', 'Fortitude', 'Pilotagem'
].map((nome) => ({ nome, desc: 'Perícia base.' }));

const $ = (id) => document.getElementById(id);
const $$ = (s) => [...document.querySelectorAll(s)];

const state = { customPericias: [] };

const session = HeroStore.getSession();
if (!session) window.location.href = 'login.html';
$('sessionUser').textContent = session.email;
if (session.role !== 'admin') $('adminLink').style.display = 'none';
$('btnLogout').addEventListener('click', () => { HeroStore.logout(); window.location.href = 'login.html'; });

function mod(v) { return Math.floor((v - 10) / 2); }
function nextXp(lvl) { return lvl * 100; }

function allPericias() { return [...BASE_PERICIAS, ...state.customPericias]; }

function milestones(lvl) {
  const out = [];
  for (let i = 2; i <= lvl; i++) {
    if (i === 2 || i === 5 || (i > 5 && (i - 5) % 5 === 0) || (i > 2 && (i - 2) % 5 === 0)) out.push(i);
  }
  return [...new Set(out)].sort((a, b) => a - b);
}

function calcPcPde(lvl, origem) {
  let total = 15;
  milestones(lvl).forEach((m) => { total += 5 + Math.floor(m / 10); });
  if (origem === 'vigilante') total += 10;
  if (origem === 'vitima') total += 15;
  return total;
}

function calcPtsAtributo(lvl) {
  let total = 0;
  for (let i = 2; i <= lvl; i++) total += 1 + Math.floor(i / 10);
  return total;
}

function parsePeso(text) {
  const arr = [...text.matchAll(/peso\s*:\s*([0-9]+(?:[.,][0-9]+)?)/gi)];
  return arr.reduce((sum, x) => sum + Number(x[1].replace(',', '.')), 0);
}

function renderSelects() {
  $('origem').innerHTML = Object.entries(ORIGENS).map(([k, v]) => `<option value="${k}">${v.nome}</option>`).join('');
  $('catMain').innerHTML = CATS.map((c) => `<option>${c}</option>`).join('');
  const sec = ['<option value="">Nenhuma</option>', ...CATS.map((c) => `<option>${c}</option>`)].join('');
  $('catSec1').innerHTML = sec;
  $('catSec2').innerHTML = sec;
}

function renderAttrs() {
  $('attrsGrid').innerHTML = ATTRS.map((a) => `<label>${a.nome}<input id="attr_${a.key}" type="number" min="8" max="20" value="10" /><small>Mod: <strong id="mod_${a.key}">0</strong></small></label>`).join('');
  $('custoTabela').innerHTML = Object.entries(COST).map(([a, c]) => `<span><b>${a}</b> → ${c}</span>`).join('');
}

function renderCatalog(target, items, attr) {
  $(target).innerHTML = items.map((it) => `<article class="catalog-item"><label><span><input type="checkbox" data-${attr}="${it.key}"/> <strong>${it.nome}</strong> (${it.custo})</span><small class="muted">${it.desc}</small></label></article>`).join('');
}

function renderPericias() {
  $('periciasList').innerHTML = allPericias().map((p) => `<label class="skill-item"><span><input type="checkbox" data-pericia="${p.nome}"/> ${p.nome}</span><small class="muted">${p.desc}</small></label>`).join('');
}

function powerEfficiency() {
  const n = [$('catSec1').value, $('catSec2').value].filter(Boolean).length;
  if (n === 2) return { factor: 4, text: '2 secundárias: 25% (x4)' };
  if (n === 1) return { factor: 2, text: '1 secundária: 50% (x2)' };
  return { factor: 1, text: 'Sem secundária.' };
}

function recalc() {
  const nivel = Math.max(1, Number($('nivel').value || 1));
  const xp = Math.max(0, Number($('xpAtual').value || 0));
  const origem = $('origem').value;

  $('sNivel').textContent = nivel;
  $('sXp').textContent = `${xp}/${nextXp(nivel)}`;
  $('origemObs').textContent = ORIGENS[origem]?.obs || '';

  let custo = 0;
  const attr = {};
  ATTRS.forEach((a) => {
    const v = Number($(`attr_${a.key}`).value || 10);
    attr[a.key] = v;
    $(`mod_${a.key}`).textContent = mod(v);
    custo += COST[v] ?? 0;
  });

  const hpMax = nivel * 5 + attr.vigor * nivel;
  const manaMax = nivel * 5 + attr.poder * nivel;
  const perBase = Math.max(0, Math.floor(2 + attr.intelecto / 2));
  const pcTotal = calcPcPde(nivel, origem);
  const pdeTotal = calcPcPde(nivel, origem);

  $('hpMax').textContent = hpMax;
  $('manaMax').textContent = manaMax;
  $('periciasBase').textContent = perBase;
  $('marcos').textContent = milestones(nivel).join(', ') || '-';

  $('custoUsado').textContent = custo;
  const saldo = BUDGET - custo;
  $('custoSaldo').textContent = saldo;
  $('custoSaldo').className = saldo < 0 ? 'bad' : 'good';
  $('ptsAttrNivel').textContent = calcPtsAtributo(nivel);

  const vidaAtual = Number($('vidaAtual').value || 0);
  const manaAtual = Number($('manaAtual').value || 0);
  $('sHp').textContent = `${Math.min(vidaAtual, hpMax)}/${hpMax}`;
  $('sMana').textContent = `${Math.min(manaAtual, manaMax)}/${manaMax}`;
  $('sCa').textContent = Number($('ca').value || 10);

  const eff = powerEfficiency();
  $('poderEf').textContent = eff.text;
  const pdeEfeitos = EFEITOS.reduce((s, e) => s + ($(`[data-efeito="${e.key}"]`)?.checked ? e.custo * eff.factor : 0), 0);
  $('pdeEfeitos').textContent = pdeEfeitos;

  const pcGasto = APTIDOES.reduce((s, a) => s + ($(`[data-apt="${a.key}"]`)?.checked ? a.custo : 0), 0)
    + TALENTOS.reduce((s, t) => s + ($(`[data-tal="${t.key}"]`)?.checked ? t.custo : 0), 0);
  $('pcTotal').textContent = pcTotal;
  $('pcGasto').textContent = pcGasto;
  $('pcSaldo').textContent = pcTotal - pcGasto;
  $('pcSaldo').className = pcTotal - pcGasto < 0 ? 'bad' : 'good';

  const pesoAtual = parsePeso($('inventario').value);
  const pesoMax = (mod(attr.forca) + 5) * 3;
  $('sPeso').textContent = `${pesoAtual.toFixed(1)} / ${pesoMax}`;
  $('sPcPde').textContent = `${pcTotal} / ${pdeTotal}`;
}

function addPericia() {
  const nome = $('newPericiaNome').value.trim();
  const desc = $('newPericiaDesc').value.trim() || 'Perícia customizada.';
  if (!nome) return;
  if (allPericias().some((p) => p.nome.toLowerCase() === nome.toLowerCase())) return;
  state.customPericias.push({ nome, desc });
  $('newPericiaNome').value = '';
  $('newPericiaDesc').value = '';
  renderPericias();
  recalc();
}

function collect() {
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
      ca: Number($('ca').value || 10),
      vidaAtual: Number($('vidaAtual').value || 0),
      manaAtual: Number($('manaAtual').value || 0),
      atributos: Object.fromEntries(ATTRS.map((a) => [a.key, Number($(`attr_${a.key}`).value || 10)])),
      periciasCustom: state.customPericias,
      periciasMarcadas: $$('[data-pericia]:checked').map((x) => x.dataset.pericia),
      poder: {
        nome: $('poderNome').value,
        descricao: $('poderDescricao').value,
        defeito: $('poderDefeito').value,
        catMain: $('catMain').value,
        catSec1: $('catSec1').value,
        catSec2: $('catSec2').value,
        efeitos: $$('[data-efeito]:checked').map((x) => x.dataset.efeito),
        resumo: $('poderResumo').value
      },
      aptidoes: $$('[data-apt]:checked').map((x) => x.dataset.apt),
      aptNotes: $('aptNotes').value,
      talentos: $$('[data-tal]:checked').map((x) => x.dataset.tal),
      talNotes: $('talNotes').value,
      inventario: $('inventario').value,
      cicatrizes: $('cicatrizes').value
    }
  };
}

function apply(payload) {
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
  $('ca').value = p.ca || 10;
  $('vidaAtual').value = p.vidaAtual || 0;
  $('manaAtual').value = p.manaAtual || 0;
  ATTRS.forEach((a) => { if (typeof p.atributos?.[a.key] === 'number') $(`attr_${a.key}`).value = p.atributos[a.key]; });

  state.customPericias = Array.isArray(p.periciasCustom) ? p.periciasCustom : [];
  renderPericias();
  $$('[data-pericia]').forEach((c) => { c.checked = p.periciasMarcadas?.includes(c.dataset.pericia) || false; });

  $('poderNome').value = p.poder?.nome || '';
  $('poderDescricao').value = p.poder?.descricao || '';
  $('poderDefeito').value = p.poder?.defeito || '';
  $('catMain').value = p.poder?.catMain || 'Ataque';
  $('catSec1').value = p.poder?.catSec1 || '';
  $('catSec2').value = p.poder?.catSec2 || '';
  $$('[data-efeito]').forEach((c) => { c.checked = p.poder?.efeitos?.includes(c.dataset.efeito) || false; });
  $('poderResumo').value = p.poder?.resumo || '';

  $$('[data-apt]').forEach((c) => { c.checked = p.aptidoes?.includes(c.dataset.apt) || false; });
  $$('[data-tal]').forEach((c) => { c.checked = p.talentos?.includes(c.dataset.tal) || false; });
  $('aptNotes').value = p.aptNotes || '';
  $('talNotes').value = p.talNotes || '';

  $('inventario').value = p.inventario || '';
  $('cicatrizes').value = p.cicatrizes || '';

  $('sheetId').value = payload.metadata?.sheetId || '';
  $('campanha').value = payload.metadata?.campanha || '';
  recalc();
}

function initTabs() {
  $$('.rz-tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      $$('.rz-tab').forEach((b) => b.classList.remove('active'));
      $$('.rz-pane').forEach((p) => p.classList.remove('active'));
      btn.classList.add('active');
      $(`tab_${btn.dataset.tab}`).classList.add('active');
    });
  });
}

function init() {
  renderSelects();
  renderAttrs();
  renderCatalog('efeitosList', EFEITOS, 'efeito');
  renderCatalog('aptidoesList', APTIDOES, 'apt');
  renderCatalog('talentosList', TALENTOS, 'tal');
  renderPericias();
  initTabs();

  $('btnAddPericia').addEventListener('click', addPericia);
  $('btnSalvar').addEventListener('click', () => {
    const data = collect();
    const id = HeroStore.upsertSheet(session.email, data);
    $('sheetId').value = id;
    setFeedback('saveFeedback', `Ficha salva! ID: ${id}`, 'success');
  });

  $('btnCarregar').addEventListener('click', () => {
    const id = $('sheetId').value.trim();
    const data = HeroStore.getSheet(session.email, id);
    if (!data) return setFeedback('saveFeedback', 'Ficha não encontrada.', 'error');
    apply(data);
    setFeedback('saveFeedback', 'Ficha carregada.', 'success');
  });

  $('btnExportar').addEventListener('click', () => exportJson(`${$('nome').value || 'ficha'}-hero.json`, collect()));
  $('btnReset').addEventListener('click', () => window.location.reload());
  document.addEventListener('input', recalc);
  document.addEventListener('change', recalc);
  recalc();
}

init();
