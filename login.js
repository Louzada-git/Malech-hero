const tabs = [...document.querySelectorAll('.tab-btn')];
const panes = [...document.querySelectorAll('.tab-pane')];

tabs.forEach((btn) => {
  btn.addEventListener('click', () => {
    tabs.forEach((b) => b.classList.remove('active'));
    panes.forEach((p) => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.target).classList.add('active');
  });
});

document.getElementById('btnRegister').addEventListener('click', () => {
  try {
    const email = document.getElementById('registerEmail').value.trim().toLowerCase();
    const senha = document.getElementById('registerSenha').value;
    const role = document.getElementById('registerRole').value;

    if (!email || senha.length < 4) throw new Error('Preencha e-mail e senha (mín. 4).');
    HeroStore.register(email, senha, role);
    HeroStore.login(email, senha);
    setFeedback('authFeedback', 'Conta criada! Redirecionando...', 'success');
    setTimeout(() => {
      window.location.href = role === 'admin' ? 'admin.html' : 'ficha.html';
    }, 500);
  } catch (err) {
    setFeedback('authFeedback', err.message, 'error');
  }
});

document.getElementById('btnLogin').addEventListener('click', () => {
  try {
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const senha = document.getElementById('loginSenha').value;
    const session = HeroStore.login(email, senha);
    setFeedback('authFeedback', 'Login efetuado com sucesso!', 'success');
    setTimeout(() => {
      window.location.href = session.role === 'admin' ? 'admin.html' : 'ficha.html';
    }, 300);
  } catch (err) {
    setFeedback('authFeedback', err.message, 'error');
  }
});

const session = HeroStore.getSession();
if (session) {
  setFeedback('authFeedback', `Sessão ativa: ${session.email} (${session.role})`, '');
}
