const ATTRS = [
  { key: 'forca', nome: 'Força' },
  { key: 'destreza', nome: 'Destreza' },
  { key: 'vigor', nome: 'Vigor' },
  { key: 'poder', nome: 'Poder' },
  { key: 'inteligencia', nome: 'Inteligência' },
  { key: 'agilidade', nome: 'Agilidade' }
];

const ATTRIBUTE_COST = {
  8: -2,
  9: -1,
  10: 0,
  11: 1,
  12: 2,
  13: 2,
  14: 3,
  15: 4,
  16: 6,
  17: 8,
  18: 10,
  19: 11,
  20: 12
};

const ORIGENS = {
  nenhuma: { dinheiro: 250, mods: {} },
  experimento: { dinheiro: 0, mods: { poder: 4, forca: -2, vigor: -2 }, obs: 'Alternativa: -2 agilidade e -2 vigor no lugar de força.' },
  favelado: { dinheiro: 50, mods: { vigor: -4, destreza: 4 } },
  vigilante: { dinheiro: 250, mods: { forca: 6 }, obs: 'Alternativa: +6 Destreza, e deve perder -2 em dois atributos à escolha.' },
  indispertado: { dinheiro: 250, mods: { poder: -10, forca: 10, destreza: 10, vigor: 10 } },
  ex_possuido: { dinheiro: 250, mods: { poder: 6, vigor: -4 } },
  amnesico: { dinheiro: 250, mods: { inteligencia: -2 }, obs: 'Escolha manualmente +4 em um atributo.' },
  nomade: { dinheiro: 250, mods: { destreza: 2 } },
  vitima: { dinheiro: 250, mods: {} },
  cacado: { dinheiro: 250, mods: {} }
};

const $ = (id) => document.getElementById(id);

function mod(attr) {
  return Math.floor((attr - 10) / 2);
}

function expParaProximoNivel(nivel) {
  return nivel * 100;
}

function ganhosAtributoPorNivel(nivel) {
  let total = 0;
  for (let l = 2; l <= nivel; l++) total += 1 + Math.floor(l / 10);
  return total;
}

function ganhosCombateEvolucao(nivel) {
  let total = 15;
  for (let l = 2; l <= nivel; l++) {
    if (l % 5 === 0 || l % 5 === 2) {
      total += 5 + Math.floor(l / 10);
    }
  }
  return total;
}

function montarAtributos() {
  const grid = $('atributosGrid');
  grid.innerHTML = '';

  ATTRS.forEach((a) => {
    const wrap = document.createElement('label');
    wrap.innerHTML = `${a.nome}
      <input type="number" id="attr_${a.key}" min="8" max="20" value="10" />
      <small>Modificador: <strong id="mod_${a.key}">0</strong></small>`;
    grid.appendChild(wrap);
  });
}

function aplicarOrigem(valorBase, key) {
  const origem = ORIGENS[$('origem').value] || ORIGENS.nenhuma;
  return valorBase + (origem.mods[key] || 0);
}

function calcularTudo() {
  const nivel = Math.max(1, Number($('nivel').value || 1));
  $('expProximo').textContent = expParaProximoNivel(nivel);

  let custoUsado = 0;
  const attrs = {};

  ATTRS.forEach((a) => {
    const base = Number($(`attr_${a.key}`).value || 10);
    const valor = aplicarOrigem(base, a.key);
    attrs[a.key] = valor;

    const custo = ATTRIBUTE_COST[base] ?? 0;
    custoUsado += custo;
    $(`mod_${a.key}`).textContent = mod(valor);
  });

  const restante = 28 - custoUsado;
  $('custoUsado').textContent = custoUsado;
  $('custoRestante').textContent = restante;
  $('custoRestante').className = restante < 0 ? 'bad' : 'good';

  const mana = nivel * 5 + attrs.poder * nivel;
  const hp = nivel * 5 + attrs.vigor * nivel;
  const pericias = Math.max(0, Math.floor(2 + attrs.inteligencia / 2));

  $('manaTotal').textContent = mana;
  $('hpTotal').textContent = hp;
  $('periciasTotal').textContent = pericias;

  const pontosCE = ganhosCombateEvolucao(nivel);
  const origem = ORIGENS[$('origem').value] || ORIGENS.nenhuma;
  const bonusVitima = $('origem').value === 'vitima' ? 15 : 0;
  const bonusVigilante = $('origem').value === 'vigilante' ? 10 : 0;

  $('pontosCombate').textContent = pontosCE + bonusVitima + bonusVigilante;
  $('pontosEvolucao').textContent = pontosCE + bonusVitima;

  $('pontosAtributoNivel').textContent = ganhosAtributoPorNivel(nivel);
  $('dinheiro').textContent = `$${origem.dinheiro}`;

  const sec1 = $('categoriaSec1').value;
  const sec2 = $('categoriaSec2').value;

  let ef = 'Sem categorias secundárias';
  if (sec1 && !sec2) ef = '1 categoria secundária: 50% de eficiência (custo x2).';
  if (sec1 && sec2) ef = '2 categorias secundárias: 25% de eficiência (custo x4).';
  $('eficienciaTexto').textContent = ef + (origem.obs ? ` Obs. origem: ${origem.obs}` : '');
}

function exportarJSON() {
  const payload = {
    nome: $('nome').value,
    origem: $('origem').value,
    nivel: Number($('nivel').value || 1),
    expAtual: Number($('expAtual').value || 0),
    atributosBase: Object.fromEntries(ATTRS.map((a) => [a.key, Number($(`attr_${a.key}`).value || 10)])),
    poder: {
      descricao: $('poderDescricao').value,
      defeito: $('poderDefeito').value,
      categoriaPrincipal: $('categoriaPrincipal').value,
      categoriaSec1: $('categoriaSec1').value,
      categoriaSec2: $('categoriaSec2').value
    },
    efeitos: $('efeitos').value.split('\n').map((x) => x.trim()).filter(Boolean),
    aptidoes: $('aptidoes').value.split('\n').map((x) => x.trim()).filter(Boolean)
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${payload.nome || 'ficha'}-hero.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function resetar() {
  document.querySelectorAll('input, textarea').forEach((el) => {
    if (el.type === 'number') {
      el.value = el.id === 'nivel' ? 1 : (el.id.startsWith('attr_') ? 10 : 0);
    } else {
      el.value = '';
    }
  });
  document.querySelectorAll('select').forEach((s) => (s.selectedIndex = 0));
  calcularTudo();
}

montarAtributos();
document.addEventListener('input', calcularTudo);
document.addEventListener('change', calcularTudo);
$('exportar').addEventListener('click', exportarJSON);
$('resetar').addEventListener('click', resetar);
calcularTudo();
