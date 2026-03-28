const ATTRS = [
  { key: 'forca', nome: 'Força' },
  { key: 'destreza', nome: 'Destreza' },
  { key: 'vigor', nome: 'Vigor' },
  { key: 'intelecto', nome: 'Intelecto' },
  { key: 'poder', nome: 'Poder' }
];

const PERICIAS = [
  'Atletismo', 'Acrobacia', 'Furtividade*', 'Reflexos', 'Crime*', 'História',
  'Investigação', 'Natureza', 'Religião+*', 'Intuição', 'Medicina+*',
  'Percepção', 'Sobrevivência*', 'Fortitude', 'Pilotagem'
];

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

function initUI() {
  $('atributosGrid').innerHTML = ATTRS
    .map(
      (a) => `<label>${a.nome}
              <input id="attr_${a.key}" type="number" min="1" value="10" />
              <small>mod: <strong id="mod_${a.key}">0</strong></small>
            </label>`
    )
    .join('');

  $('periciasLista').innerHTML = PERICIAS
    .map(
      (p) => `<label class="skill-item">
                <span><input type="checkbox" data-pericia="${p}" /> ${p}</span>
              </label>`
    )
    .join('');
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
      oficios: [$('oficio1').value, $('oficio2').value, $('oficio3').value],
      aptidoes: $('aptidoes').value,
      talentos: $('talentos').value,
      habilidades: $('habilidades').value,
      inventarioTexto: $('inventarioTexto').value,
      cicatrizes: $('cicatrizes').value,
      poder: {
        nome: $('poderNome').value,
        descricao: $('poderDescricao').value,
        efeitos: $('poderEfeitos').value
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
    if (typeof p.atributos?.[a.key] === 'number') {
      $(`attr_${a.key}`).value = p.atributos[a.key];
    }
  });

  $$('[data-pericia]').forEach((c) => {
    c.checked = p.periciasMarcadas?.includes(c.dataset.pericia) || false;
  });

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
  $('poderEfeitos').value = p.poder?.efeitos || '';

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

initUI();
calcular();
