/**
 * ============================================================
 * PAGINA HOME (INDEX)
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  configurarEventosScroll();
});

function configurarEventosScroll() {
  document.querySelectorAll('.cartao-filosofia, .pilar, .cartao-registro').forEach(elemento => {
    elemento.style.opacity = '1';
    elemento.style.transform = 'none';
  });
}
