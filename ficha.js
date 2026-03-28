const ATTRS = [
  { key: 'forca', nome: 'Força' },
  { key: 'destreza', nome: 'Destreza' },
  { key: 'vigor', nome: 'Vigor' },
  { key: 'intelecto', nome: 'Intelecto' },
  { key: 'poder', nome: 'Poder' }
];

const PERICIAS_BASE = [
  'Atletismo', 'Acrobacia', 'Furtividade*', 'Reflexos', 'Crime*', 'História',
  'Investigação', 'Natureza', 'Religião+*', 'Intuição', 'Medicina+*',
  'Percepção', 'Sobrevivência*', 'Fortitude', 'Pilotagem'
];

const EFEITOS = [
  { nome: 'Dano', custo: 7, descricao: 'Ataque direto, corpo-a-corpo ou distância média (mente). Escala com rank, mana gasta e poder.' },
  { nome: 'Criar', custo: 10, descricao: 'Cria objetos físicos e ganha melhorias por rank; em rank alto pode criar itens com poderes.' },
  { nome: 'Condição', custo: 15, descricao: 'Aplica condições debilitantes em alvo por contato, sem uso para benefícios.' },
  { nome: 'Paralisar', custo: 8, descricao: 'Impede ação por turno, reduz destreza ou força conforme alcance e escolha.' },
  { nome: 'Anular', custo: 3, descricao: 'Retira um poder ativo da cena usando ação bônus ou reação.' },
  { nome: 'Invocação', custo: 5, descricao: 'Invoca criaturas aliadas com atributos baseados em rank e mana gasta.' },
  { nome: 'Transformação', custo: 25, descricao: 'Forma transformada com aumento de atributos físicos/único atributo e efeitos temporários.' },
  { nome: 'Mover Objeto', custo: 3, descricao: 'Move objetos à distância; limite de peso/alcance cresce por rank e pode causar dano.' },
  { nome: 'Teleporte', custo: 25, descricao: 'Deslocamento instantâneo com alcance multiplicado pelo rank.' },
  { nome: 'Barreira', custo: 5, descricao: 'Cria barreira defensiva com HP baseado em mana gasta e rank.' },
  { nome: 'Cura', custo: 5, descricao: 'Recupera vida com fórmula baseada em mana gasta + rank; toque melhora eficiência.' },
  { nome: 'Comunicação', custo: 3, descricao: 'Conexão mental com alcance progressivo por rank.' },
  { nome: 'Auto-transfiguração', custo: 7, descricao: 'Modifica o próprio corpo, liberando opções extras conforme rank.' },
  { nome: 'Voo', custo: 15, descricao: 'Permite voar em velocidade baseada no deslocamento e rank.' }
];

const APTIDOES = [
  { nome: 'Acerto Crítico Aprimorado', custo: 5, descricao: 'Aumenta em 1 a margem de ameaça crítica da arma escolhida.' },
  { nome: 'Agarrar Aprimorado', custo: 2, descricao: 'Não provoca ataque de oportunidade ao agarrar e recebe +3 em agarrar.' },
  { nome: 'Ataque Atordoante', custo: 5, descricao: 'Ataque desarmado que pode atordoar alvo por 1 rodada (3 usos/descanso longo).' },
  { nome: 'Ataque Duplo', custo: 12, descricao: 'Permite dois ataques na mesma ação padrão com arma escolhida.' },
  { nome: 'Ataque Triplo', custo: 25, descricao: 'Permite três ataques na ação padrão (pré: Ataque Duplo).' },
  { nome: 'Combater com Duas Armas', custo: 15, descricao: 'Permite atacar com duas armas na mesma ação padrão (usa ação de movimento).' },
  { nome: 'Precisão Letal', custo: 8, descricao: 'Ignora 5 de defesa do alvo (5 usos por combate).' },
  { nome: 'Passo Fantasma', custo: 4, descricao: 'Move 1,5m após cada ataque sem provocar ataque de oportunidade.' },
  { nome: 'Bloqueio Melhorado', custo: 3, descricao: '+3 em bloqueios e pode proteger aliados adjacentes.' },
  { nome: 'Reflexo de Combate', custo: 3, descricao: 'Concede 1 ataque de oportunidade extra por rodada.' }
];

const TALENTOS = [
  { nome: 'Barreira', custo: 15, descricao: 'Permite converter dano recebido para gasto de mana.' },
  { nome: '4v1', custo: 15, descricao: 'Ganha +2 de dano por diferença de quantidade entre inimigos e aliados.' },
  { nome: 'Arma de Mana', custo: 15, descricao: 'Cria arma de mana (3d8 base) e escala dano com mana adicional.' },
  { nome: 'Reforço Corporal Simples', custo: 30, descricao: 'Reduz dano recebido em 10 ao gastar 5 de mana.' },
  { nome: 'Reforço Corporal Avançado', custo: 35, descricao: 'Reduz dano em 50 com 10 de mana (pré: Reforço Simples).' },
  { nome: 'Duro de Matar', custo: 25, descricao: '1x por mês ignora 90% do dano que o derrubaria.' },
  { nome: 'Coração de Mana', custo: 30, descricao: 'Recupera mana por rodada, porém aumenta risco de colapso abaixo de limites.' },
  { nome: 'Forma Fantasmagórica', custo: 25, descricao: 'Fica intangível por 2 rodadas, 2x por combate, usando apenas poderes de mana.' }
];

const $ = (id) => document.getElementById(id);
const $$ = (sel) => [...document.querySelectorAll(sel)];

const state = {
  pericias: PERICIAS_BASE.map((nome) => ({ nome, checked: false, custom: false })),
  efeitosSelecionados: [],
  aptidoesSelecionadas: [],
  talentosSelecionados: []
};

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

function extractPesoTotal(texto) {
  const pesos = [...texto.matchAll(/peso\s*:\s*([0-9]+(?:[.,][0-9]+)?)/gi)];
  return pesos.reduce((sum, m) => sum + Number(m[1].replace(',', '.')), 0);
}

function toggleFromState(listName, value) {
  const list = state[listName];
  const idx = list.indexOf(value);
  if (idx >= 0) list.splice(idx, 1);
  else list.push(value);
}

function renderPericias() {
  $('periciasLista').innerHTML = state.pericias
    .map((p, index) => `
      <label class="skill-item">
        <span><input type="checkbox" data-pericia-index="${index}" ${p.checked ? 'checked' : ''}/> ${p.nome}</span>
        ${p.custom ? `<button class="btn danger mini-btn" type="button" data-remove-pericia="${index}">Excluir</button>` : ''}
      </label>
    `)
    .join('');
}

function renderCatalog(id, list, selected, type) {
  $(id).innerHTML = list
    .map((item) => {
      const isSelected = selected.includes(item.nome);
      return `
        <article class="catalog-item ${isSelected ? 'active' : ''}">
          <div class="row-between">
            <h4>${item.nome}</h4>
            <span class="chip-cost">${item.custo} pts</span>
          </div>
          <p>${item.descricao}</p>
          <button class="btn ghost mini-btn" type="button" data-catalog-type="${type}" data-catalog-name="${item.nome}">
            ${isSelected ? 'Remover' : 'Adicionar'}
          </button>
        </article>
      `;
    })
    .join('');
}

function syncTextareas() {
  $('aptidoes').value = state.aptidoesSelecionadas.map((x) => `- ${x}`).join('\n');
  $('talentos').value = state.talentosSelecionados.map((x) => `- ${x}`).join('\n');
  $('poderEfeitos').value = state.efeitosSelecionados.map((x) => `- ${x}`).join('\n');
}

function atualizarEficienciaCategorias() {
  const sec1 = $('poderCategoriaSec1').value;
  const sec2 = $('poderCategoriaSec2').value;
  $('eficienciaCategorias').textContent = sec1 && sec2
    ? '2 secundárias: eficiência 25% (custos x4).'
    : sec1
      ? '1 secundária: eficiência 50% (custos x2).'
      : 'Sem secundárias.';
}

function initUI() {
  $('atributosGrid').innerHTML = ATTRS.map((a) => `<label>${a.nome}
      <input id="attr_${a.key}" type="number" min="1" value="10" />
      <small>mod: <strong id="mod_${a.key}">0</strong></small>
    </label>`).join('');

  renderPericias();
  renderCatalog('efeitosCatalogo', EFEITOS, state.efeitosSelecionados, 'efeitosSelecionados');
  renderCatalog('aptidoesCatalogo', APTIDOES, state.aptidoesSelecionadas, 'aptidoesSelecionadas');
  renderCatalog('talentosCatalogo', TALENTOS, state.talentosSelecionados, 'talentosSelecionados');
  syncTextareas();
  atualizarEficienciaCategorias();
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

  $('hpTotal').textContent = nivel * 5 + attrs.vigor * nivel;
  $('manaTotal').textContent = nivel * 5 + attrs.poder * nivel;
  $('periciasTotal').textContent = Math.max(0, Math.floor(2 + attrs.intelecto / 2));
  $('xpTexto').textContent = `${xpAtual}/${expNext(nivel)}`;

  const pesoAtual = extractPesoTotal($('inventarioTexto').value);
  const pesoMax = (mod(attrs.forca) + 5) * 3;
  $('pesoAtual').textContent = pesoAtual.toFixed(1);
  $('pesoMax').textContent = pesoMax;

  if (Number($('vidaAtual').value || 0) > Number($('hpTotal').textContent)) $('vidaAtual').value = $('hpTotal').textContent;
  if (Number($('manaAtual').value || 0) > Number($('manaTotal').textContent)) $('manaAtual').value = $('manaTotal').textContent;
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
      pericias: state.pericias,
      oficios: [$('oficio1').value, $('oficio2').value, $('oficio3').value],
      aptidoes: $('aptidoes').value,
      talentos: $('talentos').value,
      habilidades: $('habilidades').value,
      inventarioTexto: $('inventarioTexto').value,
      cicatrizes: $('cicatrizes').value,
      poder: {
        nome: $('poderNome').value,
        descricao: $('poderDescricao').value,
        defeito: $('poderDefeito').value,
        categoriaPrincipal: $('poderCategoriaPrincipal').value,
        categoriaSec1: $('poderCategoriaSec1').value,
        categoriaSec2: $('poderCategoriaSec2').value,
        efeitos: $('poderEfeitos').value
      },
      selecoes: {
        aptidoes: state.aptidoesSelecionadas,
        talentos: state.talentosSelecionados,
        efeitos: state.efeitosSelecionados
      }
    }
  };
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

  state.pericias = Array.isArray(p.pericias)
    ? p.pericias
    : PERICIAS_BASE.map((nome) => ({ nome, checked: false, custom: false }));

  state.aptidoesSelecionadas = p.selecoes?.aptidoes || [];
  state.talentosSelecionados = p.selecoes?.talentos || [];
  state.efeitosSelecionados = p.selecoes?.efeitos || [];

  $('oficio1').value = p.oficios?.[0] || '';
  $('oficio2').value = p.oficios?.[1] || '';
  $('oficio3').value = p.oficios?.[2] || '';

  $('aptidoes').value = p.aptidoes || '';
  $('talentos').value = p.talentos || '';
  $('habilidades').value = p.habilidades || '';
  $('inventarioTexto').value = p.inventarioTexto || '';
  $('cicatrizes').value = p.cicatrizes || '';

  $('poderNome').value = p.poder?.nome || '';
  $('poderDescricao').value = p.poder?.descricao || '';
  $('poderDefeito').value = p.poder?.defeito || '';
  $('poderCategoriaPrincipal').value = p.poder?.categoriaPrincipal || 'Ataque';
  $('poderCategoriaSec1').value = p.poder?.categoriaSec1 || '';
  $('poderCategoriaSec2').value = p.poder?.categoriaSec2 || '';
  $('poderEfeitos').value = p.poder?.efeitos || '';

  $('sheetId').value = payload.metadata?.sheetId || '';
  $('campanha').value = payload.metadata?.campanha || '';

  renderPericias();
  renderCatalog('efeitosCatalogo', EFEITOS, state.efeitosSelecionados, 'efeitosSelecionados');
  renderCatalog('aptidoesCatalogo', APTIDOES, state.aptidoesSelecionadas, 'aptidoesSelecionadas');
  renderCatalog('talentosCatalogo', TALENTOS, state.talentosSelecionados, 'talentosSelecionados');
  syncTextareas();
  atualizarEficienciaCategorias();
  calcular();
}

document.addEventListener('click', (e) => {
  const addPericia = e.target.closest('#btnAddPericia');
  if (addPericia) {
    const nome = $('novaPericia').value.trim();
    if (!nome) return;
    state.pericias.push({ nome, checked: false, custom: true });
    $('novaPericia').value = '';
    renderPericias();
    return;
  }

  const removePericiaBtn = e.target.closest('[data-remove-pericia]');
  if (removePericiaBtn) {
    const idx = Number(removePericiaBtn.dataset.removePericia);
    state.pericias.splice(idx, 1);
    renderPericias();
    return;
  }

  const catalogBtn = e.target.closest('[data-catalog-type]');
  if (catalogBtn) {
    const listName = catalogBtn.dataset.catalogType;
    const itemName = catalogBtn.dataset.catalogName;
    toggleFromState(listName, itemName);
    renderCatalog('efeitosCatalogo', EFEITOS, state.efeitosSelecionados, 'efeitosSelecionados');
    renderCatalog('aptidoesCatalogo', APTIDOES, state.aptidoesSelecionadas, 'aptidoesSelecionadas');
    renderCatalog('talentosCatalogo', TALENTOS, state.talentosSelecionados, 'talentosSelecionados');
    syncTextareas();
  }
});

document.addEventListener('change', (e) => {
  if (e.target.matches('[data-pericia-index]')) {
    const idx = Number(e.target.dataset.periciaIndex);
    if (state.pericias[idx]) state.pericias[idx].checked = e.target.checked;
  }
});

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
$('poderCategoriaSec1').addEventListener('change', atualizarEficienciaCategorias);
$('poderCategoriaSec2').addEventListener('change', atualizarEficienciaCategorias);

document.addEventListener('input', calcular);

initUI();
calcular();
