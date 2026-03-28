const HeroStore = {
  usersKey: 'hero_users_v2',
  sessionKey: 'hero_session_v2',

  getUsers() {
    return JSON.parse(localStorage.getItem(this.usersKey) || '{}');
  },

  saveUsers(users) {
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  },

  register(email, senha, role = 'player') {
    const users = this.getUsers();
    if (users[email]) throw new Error('E-mail já cadastrado.');
    users[email] = { senha, role };
    this.saveUsers(users);
  },

  login(email, senha) {
    const users = this.getUsers();
    if (!users[email] || users[email].senha !== senha) throw new Error('Credenciais inválidas.');
    const session = { email, role: users[email].role || 'player' };
    localStorage.setItem(this.sessionKey, JSON.stringify(session));
    return session;
  },

  getSession() {
    return JSON.parse(localStorage.getItem(this.sessionKey) || 'null');
  },

  logout() {
    localStorage.removeItem(this.sessionKey);
  },

  sheetBucket(email) {
    return `hero_sheets_${email}`;
  },

  getSheets(email) {
    return JSON.parse(localStorage.getItem(this.sheetBucket(email)) || '{}');
  },

  saveSheets(email, sheets) {
    localStorage.setItem(this.sheetBucket(email), JSON.stringify(sheets));
  },

  upsertSheet(email, payload) {
    const sheets = this.getSheets(email);
    const id = payload.metadata?.sheetId || `${email}-${Date.now()}`;
    payload.metadata = payload.metadata || {};
    payload.metadata.sheetId = id;
    payload.metadata.owner = email;
    sheets[id] = payload;
    this.saveSheets(email, sheets);
    return id;
  },

  getSheet(email, sheetId) {
    return this.getSheets(email)[sheetId] || null;
  },

  deleteSheet(email, sheetId) {
    const sheets = this.getSheets(email);
    delete sheets[sheetId];
    this.saveSheets(email, sheets);
  }
};

function setFeedback(id, msg, type = '') {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.className = `feedback ${type}`.trim();
}

function exportJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
