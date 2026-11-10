import { origemApi } from './configuracao-api.js';

const tituloPagina = document.querySelector('#titulo-eventos');
const estadoPagina = document.querySelector('#estado-eventos');
const conteudoPagina = document.querySelector('#conteudo-eventos');
const identificadorEvento = new URLSearchParams(location.search).get('id');

function criarImagem(url, textoAlternativo) {
  const imagem = document.createElement('img');
  imagem.src = url;
  imagem.alt = textoAlternativo;
  imagem.loading = 'lazy';
  return imagem;
}

function exibirLista(eventos) {
  if (!eventos.length) {
    estadoPagina.textContent = 'Ainda não há eventos publicados.';
    return;
  }

  conteudoPagina.className = 'grade-eventos';
  for (const evento of eventos) {
    const cartao = document.createElement('article');
    cartao.className = 'cartao-evento';
    const titulo = document.createElement('h2');
    const link = document.createElement('a');
    link.href = 'eventos.html?id=' + encodeURIComponent(evento.id);
    link.textContent = evento.titulo;
    titulo.append(link);

    const resumo = document.createElement('p');
    resumo.textContent = evento.descricao.length > 160 ? evento.descricao.slice(0, 160) + '…' : evento.descricao;
    if (evento.capa) cartao.append(criarImagem(evento.capa, ''));
    cartao.append(titulo, resumo);
    conteudoPagina.append(cartao);
  }
}

function exibirDetalhes(evento) {
  tituloPagina.textContent = evento.titulo;
  document.title = evento.titulo + ' | Rame Seishin Jutsu';
  const descricao = document.createElement('p');
  descricao.className = 'descricao-evento';
  descricao.textContent = evento.descricao;
  conteudoPagina.append(descricao);

  const galeria = document.createElement('div');
  galeria.className = 'grade-eventos galeria-evento';
  evento.fotos.forEach((url, posicao) => {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.append(criarImagem(url, 'Foto ' + (posicao + 1) + ' do evento ' + evento.titulo));
    galeria.append(link);
  });
  conteudoPagina.append(galeria);
}

async function carregarPagina() {
  const caminho = identificadorEvento ? '/eventos/' + encodeURIComponent(identificadorEvento) : '/eventos';
  if (identificadorEvento) document.querySelector('#voltar-eventos').hidden = false;

  try {
    const resposta = await fetch(origemApi + '/api' + caminho, { signal: AbortSignal.timeout(90_000) });
    if (resposta.status === 404 && identificadorEvento) {
      estadoPagina.textContent = 'Evento não encontrado.';
      return;
    }
    if (!resposta.ok) throw new Error('Resposta inválida da API');
    const resultado = await resposta.json();
    estadoPagina.textContent = '';
    if (identificadorEvento) exibirDetalhes(resultado);
    else exibirLista(resultado);
  } catch {
    estadoPagina.textContent = 'Os eventos estão indisponíveis agora. Tente recarregar a página.';
  }
}

carregarPagina();
