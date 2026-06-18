/**
 * ============================================================
 * API - GERENCIADOR DE REQUISIÇÕES HTTP
 * ============================================================
 * Funções essenciais para comunicação com o backend
 * ============================================================
 */

// Configuração centralizada
const CONFIG_API = {
  urlBase: 'http://localhost:3000/api',
  timeoutMs: 10000,
  modoDebug: true
};

/**
 * Faz requisição GET
 */
async function obterDados(nomeEndpoint) {
  const urlCompleta = `${CONFIG_API.urlBase}${nomeEndpoint}`;
  
  try {
    if (CONFIG_API.modoDebug) console.log(`[GET] ${urlCompleta}`);
    
    const resposta = await Promise.race([
      fetch(urlCompleta, { method: 'GET', headers: { 'Content-Type': 'application/json' } }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), CONFIG_API.timeoutMs))
    ]);
    
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    
    const dados = await resposta.json();
    if (CONFIG_API.modoDebug) console.log('[Resposta]', dados);
    return dados;
  } catch (erro) {
    console.error(`[ERRO GET] ${nomeEndpoint}:`, erro);
    throw erro;
  }
}

/**
 * Faz requisição POST
 */
async function enviarDados(nomeEndpoint, dadosEnvio) {
  const urlCompleta = `${CONFIG_API.urlBase}${nomeEndpoint}`;
  
  try {
    if (CONFIG_API.modoDebug) console.log(`[POST] ${urlCompleta}`, dadosEnvio);
    
    const resposta = await Promise.race([
      fetch(urlCompleta, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosEnvio)
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), CONFIG_API.timeoutMs))
    ]);
    
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    
    const dados = await resposta.json();
    if (CONFIG_API.modoDebug) console.log('[Resposta]', dados);
    return dados;
  } catch (erro) {
    console.error(`[ERRO POST] ${nomeEndpoint}:`, erro);
    throw erro;
  }
}

/**
 * Exibe mensagem de sucesso
 */
function exibirSucesso(mensagem) {
  const elemento = document.getElementById('alerta-sucesso') || criarAlertaSucesso();
  elemento.textContent = mensagem;
  elemento.style.display = 'block';
  setTimeout(() => (elemento.style.display = 'none'), 5000);
}

/**
 * Exibe mensagem de erro
 */
function exibirErro(mensagem) {
  const elemento = document.getElementById('alerta-erro') || criarAlertaErro();
  elemento.textContent = mensagem;
  elemento.style.display = 'block';
  setTimeout(() => (elemento.style.display = 'none'), 5000);
}

/**
 * Cria alerta de sucesso
 */
function criarAlertaSucesso() {
  const div = document.createElement('div');
  div.id = 'alerta-sucesso';
  div.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #28a745; color: white; padding: 16px 20px; border-radius: 6px; z-index: 9999; font-weight: 600;';
  document.body.appendChild(div);
  return div;
}

/**
 * Cria alerta de erro
 */
function criarAlertaErro() {
  const div = document.createElement('div');
  div.id = 'alerta-erro';
  div.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #ff000f; color: white; padding: 16px 20px; border-radius: 6px; z-index: 9999; font-weight: 600;';
  document.body.appendChild(div);
  return div;
}
