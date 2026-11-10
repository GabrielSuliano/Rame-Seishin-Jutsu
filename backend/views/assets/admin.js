const formularioLogin = document.querySelector('#login');
const painel = document.querySelector('#painel');
const aviso = document.querySelector('#aviso');
const formularioEvento = document.querySelector('#formulario-evento');
const listaEventos = document.querySelector('#lista-eventos');
const listaFotosSite = document.querySelector('#lista-fotos-site');
const fotosAtuais = document.querySelector('#fotos-atuais');
const selecaoFotos = document.querySelector('#selecao-fotos');
const cancelarEdicao = document.querySelector('#cancelar-edicao');
let eventoEmEdicao = null;

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

function informar(mensagem) {
  aviso.textContent = mensagem;
}

function acaoAoEnviar(formulario, executar) {
  formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const botao = formulario.querySelector('button[type="submit"], button:not([type])');
    if (botao.disabled) return;
    botao.disabled = true;
    informar('Aguarde…');
    try {
      await executar(new FormData(formulario));
    } catch (erro) {
      informar(erro.message);
    } finally {
      botao.disabled = false;
    }
  });
}

function criarBotao(texto, acao) {
  const botao = document.createElement('button');
  botao.type = 'button';
  botao.className = 'botao botao-secundario';
  botao.textContent = texto;
  botao.addEventListener('click', async () => {
    botao.disabled = true;
    try {
      await acao();
    } catch (erro) {
      informar(erro.message);
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

function encerrarEdicao() {
  eventoEmEdicao = null;
  formularioEvento.reset();
  document.querySelector('#titulo-formulario').textContent = 'Publicar evento';
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
  if (!eventos.length) listaEventos.textContent = 'Nenhum evento publicado.';
  for (const evento of eventos) {
    const cartao = document.createElement('article');
    cartao.className = 'cartao-evento';
    const titulo = document.createElement('h3');
    titulo.textContent = evento.titulo;
    if (evento.capa) cartao.append(criarImagem(evento.capa, ''));
    cartao.append(titulo, criarBotao('Editar', () => editarEvento(evento.id)), criarBotao('Excluir', async () => {
      if (!confirm('Excluir o evento "' + evento.titulo + '" e todas as suas fotos?')) return;
      const atual = await solicitar('/eventos/' + evento.id);
      await solicitar('/admin/eventos/' + evento.id, 'DELETE', { versao: atual.versao });
      if (eventoEmEdicao?.id === evento.id) encerrarEdicao();
      informar('Evento excluído.');
      await carregarEventos();
    }));
    listaEventos.append(cartao);
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
    const formulario = document.createElement('form');
    formulario.className = 'cartao-evento';
    const titulo = document.createElement('h3');
    titulo.textContent = rotulo;
    const campoFoto = document.createElement('input');
    campoFoto.type = 'file';
    campoFoto.name = 'foto';
    campoFoto.accept = 'image/jpeg,image/png,image/webp';
    campoFoto.required = true;
    campoFoto.setAttribute('aria-label', 'Selecionar nova foto para ' + rotulo);
    const salvar = document.createElement('button');
    salvar.type = 'submit';
    salvar.className = 'botao botao-primario';
    salvar.textContent = 'Substituir';
    formulario.append(criarImagem(fotos[identificador] || '/imagens/' + identificador + '.png', rotulo), titulo, campoFoto, salvar);
    if (fotos[identificador]) formulario.append(criarBotao('Restaurar original', async () => {
      await solicitar('/admin/fotos-site/' + identificador, 'DELETE');
      informar('Foto original restaurada.');
      await carregarFotosSite();
    }));
    acaoAoEnviar(formulario, async (dados) => {
      await solicitar('/admin/fotos-site/' + identificador, 'PUT', dados);
      informar('Foto substituída.');
      await carregarFotosSite();
    });
    listaFotosSite.append(formulario);
  }
}

function exibirLogin() {
  painel.hidden = true;
  formularioLogin.hidden = false;
  formularioLogin.reset();
  document.querySelector('#formulario-senha').reset();
  encerrarEdicao();
}

async function exibirPainel() {
  formularioLogin.reset();
  formularioLogin.hidden = true;
  painel.hidden = false;
  await Promise.all([carregarEventos(), carregarFotosSite()]);
}

acaoAoEnviar(formularioLogin, async (dados) => {
  await solicitar('/admin/entrar', 'POST', Object.fromEntries(dados));
  informar('');
  await exibirPainel();
});

acaoAoEnviar(formularioEvento, async (dados) => {
  const arquivos = formularioEvento.elements.fotos.files;
  if (arquivos.length > 4 || [...arquivos].some((arquivo) => arquivo.size > 6 * 1024 * 1024)) {
    throw new Error('Envie até 4 fotos por vez, de no máximo 6 MB cada.');
  }
  if (!arquivos.length) dados.delete('fotos');

  if (eventoEmEdicao) {
    dados.set('versao', eventoEmEdicao.versao);
    dados.set('manterFotos', JSON.stringify([...selecaoFotos.querySelectorAll('input:checked')].map((campo) => Number(campo.value))));
    await solicitar('/admin/eventos/' + eventoEmEdicao.id, 'PUT', dados);
  } else {
    await solicitar('/admin/eventos', 'POST', dados);
  }

  encerrarEdicao();
  informar('Evento publicado.');
  await carregarEventos();
});

acaoAoEnviar(document.querySelector('#formulario-senha'), async (dados) => {
  const { senhaAtual, novaSenha, confirmacao } = Object.fromEntries(dados);
  if (novaSenha !== confirmacao) throw new Error('A confirmação precisa ser igual à nova senha.');
  await solicitar('/admin/senha', 'PATCH', { senhaAtual, novaSenha });
  exibirLogin();
  informar('Senha alterada. Entre com a nova senha.');
});

cancelarEdicao.addEventListener('click', encerrarEdicao);
document.querySelector('#sair').addEventListener('click', async () => {
  try {
    await solicitar('/admin/sair', 'POST');
    exibirLogin();
    informar('Você saiu do painel.');
  } catch (erro) {
    informar(erro.message);
  }
});

solicitar('/admin/sessao').then(exibirPainel).catch((erro) => {
  if (painel.hidden && formularioLogin.hidden) informar(erro.message);
  else if (!painel.hidden) informar(erro.message);
});
