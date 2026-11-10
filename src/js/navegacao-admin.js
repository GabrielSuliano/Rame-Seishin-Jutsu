const menuPrincipal = document.querySelector('.menu-principal');
const linkAdmin = document.createElement('a');
linkAdmin.href = '/admin';
linkAdmin.textContent = 'Admin';

async function atualizarMenuAdmin() {
  linkAdmin.remove();
  try {
    const resposta = await fetch('/api/admin/sessao', { cache: 'no-store', signal: AbortSignal.timeout(90_000) });
    if (resposta.status === 200) menuPrincipal.append(linkAdmin);
  } catch {
    // O menu público continua disponível quando a sessão não pode ser consultada.
  }
}

if (menuPrincipal) {
  atualizarMenuAdmin();
  window.addEventListener('pageshow', (evento) => {
    if (evento.persisted) atualizarMenuAdmin();
  });
}
