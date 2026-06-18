/**
 * ============================================================
 * PAGINA HOME (INDEX)
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  configurarEventosScroll();
});

function configurarEventosScroll() {
  const elementosAnimados = document.querySelectorAll('.cartao-filosofia, .pilar, .cartao-registro');

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.style.opacity = '1';
        entrada.target.style.transform = 'translateY(0)';
      }
    });
  });

  elementosAnimados.forEach(elemento => {
    elemento.style.opacity = '0';
    elemento.style.transform = 'translateY(20px)';
    elemento.style.transition = 'all 0.6s ease';
    observador.observe(elemento);
  });
}
