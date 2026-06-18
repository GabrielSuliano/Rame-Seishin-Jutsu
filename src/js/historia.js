/**
 * ============================================================
 * PÁGINA HISTÓRIA
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  inicializarHistoria();
});

/**
 * Inicializa página de história
 */
function inicializarHistoria() {
  aplicarAnimacoesScroll();
  configurarLeituraDinamica();
}

/**
 * Aplica animações ao scroll
 */
function aplicarAnimacoesScroll() {
  const secoes = document.querySelectorAll('section');

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.style.opacity = '1';
        entrada.target.style.transition = 'opacity 0.8s ease';
      }
    });
  });

  secoes.forEach(secao => {
    secao.style.opacity = '0';
    observador.observe(secao);
  });
}

/**
 * Permite carregamento dinâmico de conteúdo do backend
 */
async function configurarLeituraDinamica() {
  // Descomente quando backend estiver pronto
  /*
  try {
    const dados = await obterDados('/conteudo/historia');
    console.log('Conteúdo dinâmico:', dados);
    // Atualizar elementos conforme necessário
  } catch (erro) {
    console.error('Erro ao carregar história:', erro);
  }
  */
}
