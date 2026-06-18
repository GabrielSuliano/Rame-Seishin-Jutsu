/**
 * ============================================================
 * PÁGINA FUNDAMENTOS
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  inicializarFundamentos();
});

/**
 * Inicializa página de fundamentos
 */
function inicializarFundamentos() {
  // Descomente para carregar conteúdo dinâmico
  // carregarFundamentosDinamicos();

  configurarAbas();
}

/**
 * Carrega fundamentos do backend
 */
async function carregarFundamentosDinamicos() {
  try {
    const resposta = await obterDados('/fundamentos');
    atualizarSecaoFundamentos(resposta);
  } catch (erro) {
    console.error('Erro ao carregar fundamentos:', erro);
    exibirErro('Erro ao carregar fundamentos');
  }
}

/**
 * Atualiza seção de fundamentos com dados do backend
 */
function atualizarSecaoFundamentos(dados) {
  console.log('Fundamentos carregados:', dados);
  // Implementar lógica de atualização conforme necessário
}

/**
 * Configura sistema de abas
 */
function configurarAbas() {
  const botaoAbas = document.querySelectorAll('.aba-titulo');
  
  botaoAbas.forEach(botao => {
    botao.addEventListener('click', () => {
      const nomeAba = botao.dataset.aba;
      ativarAba(nomeAba);
    });
  });
}

/**
 * Ativa aba específica
 */
function ativarAba(nomeAba) {
  const conteudosAbas = document.querySelectorAll('[data-conteudo-aba]');
  const botoesAbas = document.querySelectorAll('[data-aba]');

  // Desativar todas as abas
  conteudosAbas.forEach(conteudo => {
    conteudo.style.display = 'none';
  });

  botoesAbas.forEach(botao => {
    botao.classList.remove('aba-ativa');
  });

  // Ativar aba selecionada
  const abaConteudo = document.querySelector(`[data-conteudo-aba="${nomeAba}"]`);
  const abaButton = document.querySelector(`[data-aba="${nomeAba}"]`);

  if (abaConteudo) abaConteudo.style.display = 'block';
  if (abaButton) abaButton.classList.add('aba-ativa');
}

/**
 * Aplica animações de scroll
 */
function aplicarAnimacoesScroll() {
  return;
}
