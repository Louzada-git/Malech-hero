const ATTRS = [
  { key: 'forca', nome: 'Força' },
  { key: 'destreza', nome: 'Destreza' },
  { key: 'vigor', nome: 'Vigor' },
  { key: 'intelecto', nome: 'Intelecto' },
  { key: 'poder', nome: 'Poder' }
];

const PERICIAS_BASE = [
  { nome: 'Atletismo', attr: 'forca' },
  { nome: 'Acrobacia', attr: 'destreza' },
  { nome: 'Furtividade*', attr: 'destreza' },
  { nome: 'Reflexos', attr: 'destreza' },
  { nome: 'Crime*', attr: 'intelecto' },
  { nome: 'História', attr: 'intelecto' },
  { nome: 'Investigação', attr: 'intelecto' },
  { nome: 'Natureza', attr: 'intelecto' },
  { nome: 'Religião+*', attr: 'intelecto' },
  { nome: 'Intuição', attr: 'intelecto' },
  { nome: 'Medicina+*', attr: 'intelecto' },
  { nome: 'Percepção', attr: 'intelecto' },
  { nome: 'Sobrevivência*', attr: 'vigor' },
  { nome: 'Fortitude', attr: 'vigor' },
  { nome: 'Pilotagem', attr: 'destreza' }
];

const EFEITOS_CATALOGO = [
  { key: 'dano', nome: 'Dano', custo: 7, desc: 'Causa dano direto (contato/médio). Fórmula usa rank, mana gasta e poder.' },
  { key: 'criar', nome: 'Criar', custo: 10, desc: 'Cria objetos físicos por rank. Em ranks altos pode criar itens com poderes.' },
  { key: 'condicao', nome: 'Condição', custo: 15, desc: 'Impõe condições debilitantes ao alvo por contato.' },
  { key: 'anular', nome: 'Anular', custo: 3, desc: 'Cancela um poder ativo na cena usando bônus/reação.' },
  { key: 'invocacao', nome: 'Invocação', custo: 5, desc: 'Invoca criaturas aliadas com atributos baseados em rank + mana.' },
  { key: 'transformacao', nome: 'Transformação', custo: 25, desc: 'Transforma o usuário, melhorando atributos e concedendo efeitos temporários.' },
  { key: 'teleporte', nome: 'Teleporte', custo: 25, desc: 'Ignora distância no espaço instantaneamente conforme rank.' },
  { key: 'barreira', nome: 'Barreira', custo: 5, desc: 'Cria proteção com HP baseado em mana gasta e rank.' },
  { key: 'cura', nome: 'Cura', custo: 5, desc: 'Recupera vida (potência escala com mana gasta e rank).' },
  { key: 'voo', nome: 'Voo', custo: 15, desc: 'Permite deslocamento aéreo com velocidade baseada no rank.' }
];

const APTIDOES_CATALOGO = [
  { key: 'acerto_critico', nome: 'Acerto Crítico Aprimorado', custo: 5, desc: 'Aumenta margem de ameaça em 1 com arma escolhida.' },
  { key: 'agarrar_aprimorado', nome: 'Agarrar Aprimorado', custo: 2, desc: 'Não provoca ataque de oportunidade ao agarrar e recebe +3 no teste.' },
  { key: 'ataque_duplo', nome: 'Ataque Duplo', custo: 12, desc: 'Faz dois ataques na mesma ação padrão com arma escolhida.' },
  { key: 'ataque_poderoso', nome: 'Ataque Poderoso', custo: 3, desc: 'Recebe -2 no ataque para ganhar +6 no dano (uso limitado).' },
  { key: 'passo_fantasma', nome: 'Passo Fantasma', custo: 4, desc: 'Move 1,5m após ataque sem ataque de oportunidade.' },
  { key: 'foco', nome: 'Foco', custo: 8, desc: 'Uma vez por rodada, pode rerrolar um teste (usos por descanso).' },
  { key: 'bloqueio_melhorado', nome: 'Bloqueio Melhorado', custo: 3, desc: '+3 em bloqueio e pode defender aliados adjacentes.' },
  { key: 'reflexo_combate', nome: 'Reflexo de Combate', custo: 3, desc: 'Ganha uma ação de ataque de oportunidade extra por rodada.' }
];

const TALENTOS_CATALOGO = [
  { key: 'barreira_mana', nome: 'Barreira', custo: 15, desc: 'Converte parte do dano recebido para gasto de mana.' },
  { key: 'quatro_vs_um', nome: '4v1', custo: 15, desc: 'Ganha dano bônus pela diferença de quantidade entre inimigos e aliados.' },
  { key: 'ai_ai_fiquei_fodinha', nome: 'AI AI FIQUEI FODINHA', custo: 15, desc: 'Aumenta esquiva quando está com pouca vitalidade.' },
  { key: 'ultrakill', nome: 'ULTRAKILL', custo: 15, desc: 'Acumula bônus de dano ao derrotar inimigos no combate.' },
  { key: 'duro_de_matar', nome: 'DURO DE MATAR', custo: 25, desc: 'Uma vez por mês, ignora 90% de um dano letal.' },
  { key: 'coracao_mana', nome: 'Coração de mana', custo: 30, desc: 'Recupera mana por rodada, mas com alto risco ao zerar.' },
  { key: 'forma_fantasmagorica', nome: 'Forma Fantasmagórica', custo: 25, desc: 'Fica intangível por 2 rodadas (2 usos por combate).' }
];

const $ = (id) => document.getElementById(id);
const $$ = (sel) => [...document.querySelectorAll(sel)];

let periciasCustom = [];

const session = HeroStore.getSession();
if (!session) window.location.href = 'login.html';

$('sessionUser').textContent = session.email;
if (session.role !== 'admin') $('adminLink').style.display = 'none';

document.getElementById('btnLogout').addEventListener('click', () => {
  HeroStore.logout();
  window.location.href = 'login.html';
});

function mod(v) {
  return Math.floor((v - 10) / 2);
}

function expNext(n) {
  return n * 100;
}

function extractPesoTotal(texto) {
  const pesos = [...texto.matchAll(/peso\s*:\s*([0-9]+(?:[.,][0-9]+)?)/gi)];
  return pesos.reduce((sum, m) => sum + Number(m[1].replace(',', '.')), 0);
}

function labelAttr(attr) {
  return ATTRS.find((a) => a.key === attr)?.nome || attr;
}

function renderCatalog(targetId, data, type, term = '') {
  const filtered = data.filter((item) => item.nome.toLowerCase().includes(term.toLowerCase()));
  $(targetId).innerHTML = filtered.map((item) => `
    <article class="catalog-item">
      <label class="catalog-check">
        <input type="checkbox" data-${type}="${item.key}" />
        <strong>${item.nome}</strong>
      </label>
      <small class="muted">Custo: ${item.custo} ${type === 'efeito' ? 'PdE' : 'PC'}</small>
      <p>${item.desc}</p>
    </article>
  `).join('') || '<p class="muted">Nenhum resultado.</p>';
}

function renderSkills() {
  const baseHtml = PERICIAS_BASE.map((p) => `
    <label class="skill-item">
      <span><input type="checkbox" data-pericia="${p.nome}" /> ${p.nome}</span>
      <small class="muted">Base: ${labelAttr(p.attr)}</small>
    </label>
  `).join('');
  $('periciasLista').innerHTML = baseHtml;

  $('periciasCustom').innerHTML = periciasCustom.map((p, idx) => `
    <article class="catalog-item compact">
      <div class="row-between">
        <label class="catalog-check"><input type="checkbox" data-pericia-custom="${idx}" /> <strong>${p.nome}</strong></label>
        <button class="btn danger" data-rm-pericia="${idx}">Remover</button>
      </div>
      <small class="muted">Base: ${labelAttr(p.attr)}</small>
    </article>
  `).join('') || '<p class="muted">Nenhuma perícia customizada.</p>';
}

function initUI() {
  $('atributosGrid').innerHTML = ATTRS
    .map((a) => `<label>${a.nome}<input id="attr_${a.key}" type="number" min="1" value="10" /><small>mod: <strong id="mod_${a.key}">0</strong></small></label>`)
    .join('');

  renderSkills();
  renderCatalog('efeitosCatalogo', EFEITOS_CATALOGO, 'efeito');
  renderCatalog('aptidoesCatalogo', APTIDOES_CATALOGO, 'aptidao');
  renderCatalog('talentosCatalogo', TALENTOS_CATALOGO, 'talento');
}

function calcular() {
  const nivel = Math.max(1, Number($('nivel').value || 1));
  const xpAtual = Math.max(0, Number($('xpAtual').value || 0));

  const attrs = {};
  ATTRS.forEach((a) => {
    const valor = Number($(`attr_${a.key}`).value || 10);
    attrs[a.key] = valor;
    $(`mod_${a.key}`).textContent = mod(valor);
  });

  const hpTotal = nivel * 5 + attrs.vigor * nivel;
  const manaTotal = nivel * 5 + attrs.poder * nivel;
  const periciasTotal = Math.max(0, Math.floor(2 + attrs.intelecto / 2));

  $('hpTotal').textContent = hpTotal;
  $('manaTotal').textContent = manaTotal;
  $('periciasTotal').textContent = periciasTotal;
  $('xpTexto').textContent = `${xpAtual}/${expNext(nivel)}`;

  const pesoAtual = extractPesoTotal($('inventarioTexto').value);
  const pesoMax = (mod(attrs.forca) + 5) * 3;
  $('pesoAtual').textContent = pesoAtual.toFixed(1);
  $('pesoMax').textContent = pesoMax;

  if (Number($('vidaAtual').value || 0) > hpTotal) $('vidaAtual').value = hpTotal;
  if (Number($('manaAtual').value || 0) > manaTotal) $('manaAtual').value = manaTotal;
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
      idade: Number($('idade').value || 18),
      codenome: $('codenome').value,
      rank: $('rank').value,
      turma: $('turma').value,
      nivel: Number($('nivel').value || 1),
      xpAtual: Number($('xpAtual').value || 0),
      vidaAtual: Number($('vidaAtual').value || 0),
      manaAtual: Number($('manaAtual').value || 0),
      ca: Number($('ca').value || 10),
      atributos: Object.fromEntries(ATTRS.map((a) => [a.key, Number($(`attr_${a.key}`).value || 10)])),
      periciasMarcadas: $$('[data-pericia]:checked').map((x) => x.dataset.pericia),
      periciasCustom,
      periciasCustomMarcadas: $$('[data-pericia-custom]:checked').map((x) => Number(x.dataset.periciaCustom)),
      oficios: [$('oficio1').value, $('oficio2').value, $('oficio3').value],
      aptidoesSelecionadas: $$('[data-aptidao]:checked').map((x) => x.dataset.aptidao),
      aptidoesNotas: $('aptidoesNotas').value,
      talentosSelecionados: $$('[data-talento]:checked').map((x) => x.dataset.talento),
      talentosNotas: $('talentosNotas').value,
      habilidades: $('habilidades').value,
      inventarioTexto: $('inventarioTexto').value,
      cicatrizes: $('cicatrizes').value,
      poder: {
        nome: $('poderNome').value,
        categoriaPrincipal: $('poderCategoriaPrincipal').value,
        categoriaSecundaria: $('poderCategoriaSecundaria').value,
        descricao: $('poderDescricao').value,
        defeito: $('poderDefeito').value,
        efeitosSelecionados: $$('[data-efeito]:checked').map((x) => x.dataset.efeito),
        execucao: $('poderExecucao').value
      }
    }
  };
}

function applyChecks(selector, keys) {
  const set = new Set(keys || []);
  $$(selector).forEach((x) => {
    const dataKey = Object.keys(x.dataset)[0];
    x.checked = set.has(x.dataset[dataKey]);
  });
}

function aplicarFicha(payload) {
  const p = payload?.personagem;
  if (!p) return;

  $('nome').value = p.nome || '';
  $('idade').value = p.idade || 18;
  $('codenome').value = p.codenome || '';
  $('rank').value = p.rank || '';
  $('turma').value = p.turma || '';
  $('nivel').value = p.nivel || 1;
  $('xpAtual').value = p.xpAtual || 0;
  $('vidaAtual').value = p.vidaAtual || 0;
  $('manaAtual').value = p.manaAtual || 0;
  $('ca').value = p.ca || 10;

  ATTRS.forEach((a) => {
    if (typeof p.atributos?.[a.key] === 'number') $(`attr_${a.key}`).value = p.atributos[a.key];
  });

  periciasCustom = Array.isArray(p.periciasCustom) ? p.periciasCustom : [];
  renderSkills();
  applyChecks('[data-pericia]', p.periciasMarcadas);

  const customMarked = new Set(p.periciasCustomMarcadas || []);
  $$('[data-pericia-custom]').forEach((c) => {
    c.checked = customMarked.has(Number(c.dataset.periciaCustom));
  });

  $('oficio1').value = p.oficios?.[0] || '';
  $('oficio2').value = p.oficios?.[1] || '';
  $('oficio3').value = p.oficios?.[2] || '';

  applyChecks('[data-aptidao]', p.aptidoesSelecionadas);
  $('aptidoesNotas').value = p.aptidoesNotas || '';

  applyChecks('[data-talento]', p.talentosSelecionados);
  $('talentosNotas').value = p.talentosNotas || '';

  $('habilidades').value = p.habilidades || '';
  $('inventarioTexto').value = p.inventarioTexto || '';
  $('cicatrizes').value = p.cicatrizes || '';

  $('poderNome').value = p.poder?.nome || '';
  $('poderCategoriaPrincipal').value = p.poder?.categoriaPrincipal || 'Ataque';
  $('poderCategoriaSecundaria').value = p.poder?.categoriaSecundaria || '';
  $('poderDescricao').value = p.poder?.descricao || '';
  $('poderDefeito').value = p.poder?.defeito || '';
  applyChecks('[data-efeito]', p.poder?.efeitosSelecionados);
  $('poderExecucao').value = p.poder?.execucao || '';

  $('sheetId').value = payload.metadata?.sheetId || '';
  $('campanha').value = payload.metadata?.campanha || '';
  calcular();
}

$('btnAddPericia').addEventListener('click', () => {
  const nome = $('novaPericiaNome').value.trim();
  const attr = $('novaPericiaAttr').value;
  if (!nome) return;
  periciasCustom.push({ nome, attr });
  $('novaPericiaNome').value = '';
  renderSkills();
  calcular();
});

document.addEventListener('click', (e) => {
  const idx = e.target?.dataset?.rmPericia;
  if (idx === undefined) return;
  periciasCustom.splice(Number(idx), 1);
  renderSkills();
});

$('buscaEfeito').addEventListener('input', (e) => renderCatalog('efeitosCatalogo', EFEITOS_CATALOGO, 'efeito', e.target.value));
$('buscaAptidao').addEventListener('input', (e) => renderCatalog('aptidoesCatalogo', APTIDOES_CATALOGO, 'aptidao', e.target.value));
$('buscaTalento').addEventListener('input', (e) => renderCatalog('talentosCatalogo', TALENTOS_CATALOGO, 'talento', e.target.value));

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

initUI();
calcular();
