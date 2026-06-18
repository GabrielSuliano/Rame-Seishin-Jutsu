/**
 * ============================================================
 * PÁGINA MESTRES E PROFESSORES
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  inicializarMestres();
});

/**
 * Inicializa página de mestres
 */
function inicializarMestres() {
  // Descomente para carregar mestres do backend
  // carregarMestresDinamicos();
  
  configurarFiltroTabela();
  configurarOrdenacaoTabela();
}

/**
 * Carrega mestres do backend
 */
async function carregarMestresDinamicos() {
  try {
    const resposta = await obterDados('/mestres');
    preencherTabelaMestres(resposta.mestres);
  } catch (erro) {
    console.error('Erro ao carregar mestres:', erro);
    exibirErro('Erro ao carregar tabela de mestres');
  }
}

/**
 * Preenche tabela com dados de mestres
 */
function preencherTabelaMestres(listaMestres) {
  const corpoTabela = document.querySelector('#tabelaMestres tbody');
  if (!corpoTabela) return;

  corpoTabela.innerHTML = listaMestres
    .map(mestre => `
      <tr>
        <td class="grau">${mestre.grau}</td>
        <td class="nome">${mestre.nome}</td>
        <td class="posicao">${mestre.posicao || ''}</td>
      </tr>
    `)
    .join('');
}

/**
 * Configura filtro de busca na tabela
 */
function configurarFiltroTabela() {
  // Criar campo de busca dinamicamente se não existir
  const tabelaContainer = document.querySelector('.tabela-responsiva');
  if (!tabelaContainer) return;

  const campoBusca = document.createElement('input');
  campoBusca.type = 'text';
  campoBusca.placeholder = 'Buscar por nome ou grau...';
  campoBusca.className = 'campo-busca-mestres';
  campoBusca.style.cssText = 'margin-bottom: 20px; padding: 10px 15px; width: 100%; border: 1px solid #ddd; border-radius: 6px; font-size: 0.95rem;';

  campoBusca.addEventListener('input', (evento) => {
    filtrarLinhasTabela(evento.target.value);
  });

  tabelaContainer.parentElement.insertBefore(campoBusca, tabelaContainer);
}

/**
 * Filtra linhas da tabela por texto
 */
function filtrarLinhasTabela(textoBusca) {
  const linhas = document.querySelectorAll('#tabelaMestres tbody tr');
  const textoBuscaMinusculo = textoBusca.toLowerCase();

  linhas.forEach(linha => {
    const conteudoLinha = linha.textContent.toLowerCase();
    linha.style.display = conteudoLinha.includes(textoBuscaMinusculo) ? '' : 'none';
  });
}

/**
 * Configura ordenação de colunas
 */
function configurarOrdenacaoTabela() {
  const cabecalho = document.querySelector('#tabelaMestres thead');
  if (!cabecalho) return;

  const colunas = cabecalho.querySelectorAll('th');
  colunas.forEach((coluna, indice) => {
    coluna.style.cursor = 'pointer';
    coluna.style.userSelect = 'none';

    coluna.addEventListener('click', () => {
      ordenarColuna(indice);
    });
  });
}

/**
 * Ordena tabela por coluna específica
 */
function ordenarColuna(indiceColuna) {
  const tabela = document.querySelector('#tabelaMestres');
  const linhas = Array.from(tabela.querySelectorAll('tbody tr'));

  const estaAscendente = tabela.dataset.ordenacao === `coluna-${indiceColuna}-asc`;
  
  linhas.sort((a, b) => {
    const textoA = a.children[indiceColuna].textContent.trim();
    const textoB = b.children[indiceColuna].textContent.trim();
    
    const comparacao = textoA.localeCompare(textoB, 'pt-BR');
    return estaAscendente ? -comparacao : comparacao;
  });

  linhas.forEach(linha => tabela.querySelector('tbody').appendChild(linha));
  tabela.dataset.ordenacao = estaAscendente ? `coluna-${indiceColuna}-desc` : `coluna-${indiceColuna}-asc`;
}
