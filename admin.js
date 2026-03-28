const session = HeroStore.getSession();
if (!session || session.role !== 'admin') window.location.href = 'login.html';

document.getElementById('adminName').textContent = session.email;

document.getElementById('btnLogout').addEventListener('click', () => {
  HeroStore.logout();
  window.location.href = 'login.html';
});

let selectedPlayer = null;
let selectedSheetId = null;

function allPlayers() {
  const users = HeroStore.getUsers();
  return Object.entries(users)
    .filter(([, data]) => data.role === 'player')
    .map(([email]) => email);
}

function renderPlayers() {
  const players = allPlayers();
  const root = document.getElementById('playersList');
  root.innerHTML = players.length
    ? players.map((p) => `<button class="btn ghost player-btn" data-player="${p}">${p}</button>`).join('')
    : '<p class="muted">Sem players cadastrados.</p>';

  document.querySelectorAll('.player-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedPlayer = btn.dataset.player;
      renderSheets(selectedPlayer);
    });
  });
}

function renderSheets(playerEmail) {
  const sheets = HeroStore.getSheets(playerEmail);
  const ids = Object.keys(sheets);
  const root = document.getElementById('sheetsList');

  root.innerHTML = ids.length
    ? ids.map((id) => `<button class="btn sheet-btn" data-id="${id}">${id}</button>`).join('')
    : '<p class="muted">Este player não possui fichas.</p>';

  document.querySelectorAll('.sheet-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedSheetId = btn.dataset.id;
      const payload = HeroStore.getSheet(playerEmail, selectedSheetId);
      document.getElementById('sheetJson').value = JSON.stringify(payload, null, 2);
      setFeedback('adminFeedback', `Ficha ${selectedSheetId} carregada para edição.`, 'success');
    });
  });
}

document.getElementById('btnSalvarSheet').addEventListener('click', () => {
  try {
    if (!selectedPlayer || !selectedSheetId) throw new Error('Selecione player e ficha primeiro.');

    const raw = document.getElementById('sheetJson').value;
    const payload = JSON.parse(raw);
    payload.metadata = payload.metadata || {};
    payload.metadata.sheetId = selectedSheetId;
    payload.metadata.owner = selectedPlayer;

    HeroStore.upsertSheet(selectedPlayer, payload);
    setFeedback('adminFeedback', 'Alterações salvas com sucesso.', 'success');
  } catch (err) {
    setFeedback('adminFeedback', `Erro ao salvar: ${err.message}`, 'error');
  }
});

document.getElementById('btnExcluirSheet').addEventListener('click', () => {
  try {
    if (!selectedPlayer || !selectedSheetId) throw new Error('Selecione uma ficha primeiro.');
    HeroStore.deleteSheet(selectedPlayer, selectedSheetId);
    document.getElementById('sheetJson').value = '';
    setFeedback('adminFeedback', `Ficha ${selectedSheetId} excluída.`, 'success');
    selectedSheetId = null;
    renderSheets(selectedPlayer);
  } catch (err) {
    setFeedback('adminFeedback', err.message, 'error');
  }
});

renderPlayers();
