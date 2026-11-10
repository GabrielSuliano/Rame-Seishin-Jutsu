const formularioLogin = document.querySelector('#login');
const telaLogin = document.querySelector('#tela-login');
const estadoInicial = document.querySelector('#estado-inicial');
const painel = document.querySelector('#painel');
const avisoLogin = document.querySelector('#aviso-login');
const avisoPainel = document.querySelector('#aviso-painel');
const avisoListaEventos = document.querySelector('#aviso-lista-eventos');
const menuSiteAdmin = document.querySelector('#menu-site-admin');
const avisoEquipe = document.querySelector('#aviso-equipe');
const modeloRedefinirSenha = document.querySelector('#modelo-redefinir-senha');
const modeloControleSenha = document.querySelector('#modelo-controle-senha');
const formularioEvento = document.querySelector('#formulario-evento');
const listaEventos = document.querySelector('#lista-eventos');
const listaFotosSite = document.querySelector('#lista-fotos-site');
const listaAdministradores = document.querySelector('#lista-administradores');
const formularioAdministrador = document.querySelector('#formulario-administrador');
const formularioSenha = document.querySelector('#formulario-senha');
const fotosAtuais = document.querySelector('#fotos-atuais');
const selecaoFotos = document.querySelector('#selecao-fotos');
const cancelarEdicao = document.querySelector('#cancelar-edicao');
const botaoSair = document.querySelector('#sair');
const linksSecoes = [...document.querySelectorAll('[data-secao]')];
const formatoData = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeZone: 'America/Sao_Paulo' });
let eventoEmEdicao = null;
let contadorCamposSenha = 0;

async function solicitar(caminho, metodo = 'GET', dados) {
  const cabecalhos = {};
  if (metodo !== 'GET') cabecalhos['X-Painel-Rame'] = '1';
  if (dados && !(dados instanceof FormData)) {
    cabecalhos['Content-Type'] = 'application/json';
    dados = JSON.stringify(dados);
  }

  const resposta = await fetch('/api' + caminho, { method: metodo, headers: cabecalhos, body: dados });
  if (resposta.status === 204) return;
  const resultado = await resposta.json().catch(() => null);
  if (!resposta.ok) {
    if (resposta.status === 401 && caminho !== '/admin/entrar') exibirLogin();
    throw new Error(resultado?.mensagem || 'Não foi possível concluir a operação.');
  }
  return resultado;
}

function informar(destino, mensagem, tipo = 'info') {
  destino.dataset.tipo = tipo;
  destino.textContent = mensagem;
}

function criarElemento(tipo, classe, texto) {
  const elemento = document.createElement(tipo);
  if (classe) elemento.className = classe;
  if (texto) elemento.textContent = texto;
  return elemento;
}

function acaoAoEnviar(formulario, executar) {
  const avisoFormulario = formulario.querySelector('[data-aviso-formulario]');
  function avisar(mensagem, tipo) {
    const destino = painel.hidden ? avisoLogin : formulario === formularioLogin ? avisoPainel : avisoFormulario;
    informar(destino, mensagem, tipo);
  }

  formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const botao = formulario.querySelector('button[type="submit"], button:not([type])');
    if (botao.disabled) return;
    botao.disabled = true;
    avisar('Aguarde…');
    try {
      await executar(new FormData(formulario), avisar);
    } catch (erro) {
      avisar(erro.message, 'erro');
    } finally {
      botao.disabled = false;
    }
  });
}

function criarBotao(texto, acao, destinoAviso, classe = 'botao-neutro') {
  const botao = criarElemento('button', 'botao-admin ' + classe, texto);
  botao.type = 'button';
  botao.addEventListener('click', async () => {
    botao.disabled = true;
    try {
      await acao();
    } catch (erro) {
      informar(painel.hidden ? avisoLogin : destinoAviso, erro.message, 'erro');
    } finally {
      botao.disabled = false;
    }
  });
  return botao;
}

function criarImagem(url, textoAlternativo) {
  const imagem = document.createElement('img');
  imagem.src = url;
  imagem.alt = textoAlternativo;
  imagem.loading = 'lazy';
  return imagem;
}

function exibirSecao() {
  const linkAtivo = linksSecoes.find((link) => !link.hidden && link.hash === location.hash) || linksSecoes[0];
  for (const link of linksSecoes) {
    const selecionado = link === linkAtivo;
    if (selecionado) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
    document.getElementById(link.dataset.secao).hidden = !selecionado;
  }
}

function encerrarEdicao() {
  eventoEmEdicao = null;
  formularioEvento.reset();
  document.querySelector('#titulo-formulario').textContent = 'Publicar evento';
  document.querySelector('#salvar-evento').textContent = 'Salvar e publicar';
  fotosAtuais.hidden = true;
  selecaoFotos.replaceChildren();
  cancelarEdicao.hidden = true;
}

async function editarEvento(identificador) {
  const evento = await solicitar('/eventos/' + identificador);
  encerrarEdicao();
  eventoEmEdicao = evento;
  formularioEvento.elements.titulo.value = evento.titulo;
  formularioEvento.elements.descricao.value = evento.descricao;
  document.querySelector('#titulo-formulario').textContent = 'Editar evento';
  document.querySelector('#salvar-evento').textContent = 'Salvar alterações';
  cancelarEdicao.hidden = false;
  fotosAtuais.hidden = !evento.fotos.length;
  evento.fotos.forEach((url, posicao) => {
    const rotulo = document.createElement('label');
    const caixa = document.createElement('input');
    caixa.type = 'checkbox';
    caixa.value = posicao;
    caixa.checked = true;
    rotulo.append(criarImagem(url, ''), caixa, ' Manter foto ' + (posicao + 1));
    selecaoFotos.append(rotulo);
  });
  formularioEvento.elements.titulo.focus();
}

async function carregarEventos() {
  const eventos = await solicitar('/eventos');
  listaEventos.replaceChildren();
  document.querySelector('#total-eventos').textContent = eventos.length === 1 ? '1 evento' : eventos.length + ' eventos';
  if (!eventos.length) {
    listaEventos.append(criarElemento('p', 'vazio-admin', 'Seus eventos publicados aparecerão aqui.'));
    return;
  }

  for (const evento of eventos) {
    const linha = criarElemento('article', 'linha-evento-admin');
    const corpo = document.createElement('div');
    const data = criarElemento('time', 'data-admin', formatoData.format(new Date(evento.criado_em)));
    data.dateTime = evento.criado_em;
    const acoes = criarElemento('div', 'acoes-admin');
    acoes.append(criarBotao('Editar', () => editarEvento(evento.id), avisoListaEventos), criarBotao('Excluir', async () => {
      if (!confirm('Excluir o evento "' + evento.titulo + '" e todas as suas fotos?')) return;
      const atual = await solicitar('/eventos/' + evento.id);
      await solicitar('/admin/eventos/' + evento.id, 'DELETE', { versao: atual.versao });
      if (eventoEmEdicao?.id === evento.id) encerrarEdicao();
      await carregarEventos();
      informar(avisoListaEventos, 'Evento excluído.', 'sucesso');
    }, avisoListaEventos, 'botao-perigo'));
    corpo.append(criarElemento('h3', '', evento.titulo), data, acoes);
    linha.append(evento.capa ? criarImagem(evento.capa, '') : criarElemento('span', 'capa-vazia-admin', 'RAME'), corpo);
    listaEventos.append(linha);
  }
}

async function carregarFotosSite() {
  const fotos = await solicitar('/fotos-site');
  listaFotosSite.replaceChildren();
  for (const [identificador, rotulo] of Object.entries({
    foto1: 'Mestres reunidos no dojo',
    foto2: 'Foto de grupo e capas das páginas',
    foto3: 'Demonstração de técnica',
    foto4: 'Retrato de mestre'
  })) {
    const formulario = criarElemento('form', 'cartao-foto-admin');
    const corpo = criarElemento('div', 'corpo-foto-admin');
    const rotuloFoto = criarElemento('label', 'campo-admin envio-admin', 'Nova imagem');
    const campoFoto = document.createElement('input');
    campoFoto.type = 'file';
    campoFoto.name = 'foto';
    campoFoto.accept = 'image/jpeg,image/png,image/webp';
    campoFoto.required = true;
    campoFoto.setAttribute('aria-label', 'Selecionar nova foto para ' + rotulo);
    rotuloFoto.append(campoFoto);
    const acoes = criarElemento('div', 'acoes-admin');
    const salvar = criarElemento('button', 'botao-admin botao-acao', 'Substituir');
    salvar.type = 'submit';
    const avisoFoto = criarElemento('p', 'aviso-admin');
    avisoFoto.dataset.avisoFormulario = '';
    avisoFoto.setAttribute('role', 'status');
    avisoFoto.setAttribute('aria-atomic', 'true');
    const imagem = criarImagem(fotos[identificador] || '/imagens/' + identificador + '.png', rotulo);
    const marcador = criarElemento('span', 'marcador-admin');
    const restaurar = criarBotao('Restaurar original', async () => {
      await solicitar('/admin/fotos-site/' + identificador, 'DELETE');
      exibirFoto();
      informar(avisoFoto, 'Foto original restaurada.', 'sucesso');
    }, avisoFoto);

    function exibirFoto(url) {
      imagem.src = url || '/imagens/' + identificador + '.png';
      marcador.textContent = url ? 'Personalizada' : 'Original';
      restaurar.hidden = !url;
    }

    exibirFoto(fotos[identificador]);
    acoes.append(salvar, restaurar);
    corpo.append(marcador, criarElemento('h3', '', rotulo), rotuloFoto, avisoFoto, acoes);
    formulario.append(imagem, corpo);

    acaoAoEnviar(formulario, async (dados, avisar) => {
      if (campoFoto.files[0]?.size > 6 * 1024 * 1024) throw new Error('Escolha uma foto de até 6 MB.');
      await solicitar('/admin/fotos-site/' + identificador, 'PUT', dados);
      const fotosAtualizadas = await solicitar('/fotos-site');
      exibirFoto(fotosAtualizadas[identificador]);
      formulario.reset();
      avisar('Foto substituída.', 'sucesso');
    });
    listaFotosSite.append(formulario);
  }
}

function criarLinhaAdministrador(conta) {
  const linha = document.createElement('li');
  const cabecalho = criarElemento('div', 'conta-admin');
  cabecalho.append(criarElemento('strong', '', conta.nome),
    criarElemento('span', 'marcador-admin', conta.principal ? 'Conta principal' : 'Administrador'));
  linha.append(cabecalho);
  if (conta.principal) return linha;

  const caminhoConta = '/admin/administradores/' + encodeURIComponent(conta.id);
  const formulario = modeloRedefinirSenha.content.firstElementChild.cloneNode(true);
  prepararControlesSenha(formulario);
  const avisoFormulario = formulario.querySelector('[data-aviso-formulario]');
  const acoes = criarElemento('div', 'acoes-admin acoes-conta-admin');
  const redefinir = criarBotao('Redefinir senha', () => {
    formulario.hidden = false;
    redefinir.hidden = true;
    informar(avisoEquipe, '');
    formulario.elements.novaSenha.focus();
  }, avisoEquipe);
  redefinir.setAttribute('aria-label', 'Redefinir senha de ' + conta.nome);

  function fecharFormulario() {
    formulario.reset();
    informar(avisoFormulario, '');
    formulario.hidden = true;
    redefinir.hidden = false;
    redefinir.focus();
  }

  const caixaExclusao = criarElemento('div', 'redefinir-senha-admin');
  caixaExclusao.hidden = true;
  const excluir = criarBotao('Excluir', () => {
    caixaExclusao.hidden = false;
    excluir.hidden = true;
    cancelarExclusao.focus();
  }, avisoEquipe, 'botao-perigo');
  excluir.setAttribute('aria-label', 'Excluir administrador ' + conta.nome);
  const confirmarExclusao = criarBotao('Confirmar exclusão', async () => {
    await solicitar(caminhoConta, 'DELETE');
    linha.remove();
    informar(avisoEquipe, 'Administrador excluído.', 'sucesso');
  }, avisoEquipe, 'botao-perigo');
  const cancelarExclusao = criarBotao('Cancelar exclusão', () => {
    caixaExclusao.hidden = true;
    excluir.hidden = false;
    excluir.focus();
  }, avisoEquipe);
  const acoesExclusao = criarElemento('div', 'acoes-admin acoes-conta-admin');
  acoesExclusao.append(confirmarExclusao, cancelarExclusao);
  caixaExclusao.append(criarElemento('p', 'texto-apoio', 'Remover o acesso de ' + conta.nome + ' ao painel?'), acoesExclusao);

  formulario.querySelector('[data-cancelar]').addEventListener('click', fecharFormulario);
  acaoAoEnviar(formulario, async (dados) => {
    const { novaSenha, confirmacao } = Object.fromEntries(dados);
    if (novaSenha !== confirmacao) throw new Error('A confirmação precisa ser igual à nova senha.');
    await solicitar(caminhoConta + '/senha', 'PATCH', { novaSenha });
    fecharFormulario();
    informar(avisoEquipe, 'Senha redefinida.', 'sucesso');
  });

  acoes.append(redefinir, excluir);
  linha.append(acoes, formulario, caixaExclusao);
  return linha;
}

async function carregarAdministradores() {
  const contas = await solicitar('/admin/administradores');
  listaAdministradores.replaceChildren(...[{ nome: 'admin', principal: true }, ...contas].map(criarLinhaAdministrador));
}

function prepararControlesSenha(formulario) {
  for (const campo of formulario.querySelectorAll('[data-visualizar-senha]')) {
    const controle = modeloControleSenha.content.firstElementChild.cloneNode(true);
    const grupoCampo = campo.closest('.campo-admin');
    if (!campo.id) campo.id = 'campo-senha-' + ++contadorCamposSenha;
    grupoCampo.querySelector('label').htmlFor = campo.id;
    controle.setAttribute('aria-controls', campo.id);

    function alterarVisibilidade(visivel) {
      campo.type = visivel ? 'text' : 'password';
      controle.toggleAttribute('data-visivel', visivel);
      const rotulo = (visivel ? 'Ocultar ' : 'Mostrar ') + campo.dataset.visualizarSenha;
      controle.setAttribute('aria-label', rotulo);
      controle.title = rotulo;
    }

    controle.addEventListener('click', () => alterarVisibilidade(campo.type === 'password'));
    formulario.addEventListener('reset', () => alterarVisibilidade(false));
    alterarVisibilidade(false);
    campo.parentElement.append(controle);
  }
}

function exibirLogin() {
  estadoInicial.hidden = true;
  painel.hidden = true;
  botaoSair.hidden = true;
  menuSiteAdmin.hidden = true;
  telaLogin.hidden = false;
  informar(avisoLogin, '');
  formularioLogin.reset();
  formularioSenha.reset();
  formularioAdministrador.reset();
  encerrarEdicao();
}

async function exibirPainel(sessao) {
  estadoInicial.hidden = true;
  formularioLogin.reset();
  telaLogin.hidden = true;
  painel.hidden = false;
  menuSiteAdmin.hidden = false;
  painel.querySelectorAll('.aviso-admin').forEach((destino) => informar(destino, ''));
  botaoSair.hidden = false;
  document.querySelector('#nome-admin').textContent = sessao.nome;
  document.querySelector('#avatar-admin').textContent = sessao.nome[0].toLocaleUpperCase('pt-BR');
  document.querySelector('#perfil-admin').textContent = sessao.principal ? 'Conta principal' : 'Administrador';
  document.querySelector('#link-administradores').hidden = !sessao.principal;
  exibirSecao();
  const tarefas = [carregarEventos(), carregarFotosSite()];
  if (sessao.principal) tarefas.push(carregarAdministradores());
  await Promise.all(tarefas);
}

acaoAoEnviar(formularioLogin, async (dados) => {
  await solicitar('/admin/entrar', 'POST', Object.fromEntries(dados));
  const sessao = await solicitar('/admin/sessao');
  await exibirPainel(sessao);
});

acaoAoEnviar(formularioEvento, async (dados, avisar) => {
  const arquivos = formularioEvento.elements.fotos.files;
  if (arquivos.length > 4 || [...arquivos].some((arquivo) => arquivo.size > 6 * 1024 * 1024)) {
    throw new Error('Envie até 4 fotos por vez, de no máximo 6 MB cada.');
  }
  if (!arquivos.length) dados.delete('fotos');

  const eventoAtual = eventoEmEdicao;
  if (eventoAtual) {
    dados.set('versao', eventoAtual.versao);
    dados.set('manterFotos', JSON.stringify([...selecaoFotos.querySelectorAll('input:checked')].map((campo) => Number(campo.value))));
    await solicitar('/admin/eventos/' + eventoAtual.id, 'PUT', dados);
  } else {
    await solicitar('/admin/eventos', 'POST', dados);
  }

  encerrarEdicao();
  await carregarEventos();
  avisar(eventoAtual ? 'Evento atualizado.' : 'Evento publicado.', 'sucesso');
});

acaoAoEnviar(formularioAdministrador, async (dados, avisar) => {
  const { nome, senha, confirmacao } = Object.fromEntries(dados);
  if (senha !== confirmacao) throw new Error('A confirmação precisa ser igual à senha inicial.');
  const conta = await solicitar('/admin/administradores', 'POST', { nome, senha });
  formularioAdministrador.reset();
  listaAdministradores.append(criarLinhaAdministrador(conta));
  avisar('Administrador cadastrado.', 'sucesso');
});

acaoAoEnviar(formularioSenha, async (dados, avisar) => {
  const { senhaAtual, novaSenha, confirmacao } = Object.fromEntries(dados);
  if (novaSenha !== confirmacao) throw new Error('A confirmação precisa ser igual à nova senha.');
  await solicitar('/admin/senha', 'PATCH', { senhaAtual, novaSenha });
  exibirLogin();
  avisar('Senha alterada. Entre com a nova senha.', 'sucesso');
});

cancelarEdicao.addEventListener('click', encerrarEdicao);
window.addEventListener('hashchange', exibirSecao);
prepararControlesSenha(formularioLogin);
prepararControlesSenha(formularioSenha);
botaoSair.addEventListener('click', async () => {
  try {
    await solicitar('/admin/sair', 'POST');
    exibirLogin();
    informar(avisoLogin, 'Você saiu do painel.', 'sucesso');
  } catch (erro) {
    informar(avisoPainel, erro.message, 'erro');
  }
});

solicitar('/admin/sessao').then(exibirPainel).catch((erro) => {
  if (!telaLogin.hidden) return;
  if (painel.hidden) exibirLogin();
  informar(painel.hidden ? avisoLogin : avisoPainel, erro.message, 'erro');
});
