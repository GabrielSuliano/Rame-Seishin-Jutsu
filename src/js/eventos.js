import { origemApi } from './configuracao-api.js';

const tituloPagina = document.querySelector('#titulo-eventos');
const tituloAcervo = document.querySelector('#titulo-acervo');
const estadoPagina = document.querySelector('#estado-eventos');
const complementoPagina = document.querySelector('#complemento-eventos');
const quadroEventos = document.querySelector('#quadro-eventos');
const botaoTentar = document.querySelector('#tentar-eventos');
const conteudoPagina = document.querySelector('#conteudo-eventos');
const contagem = document.querySelector('#contagem-eventos');
const visualizador = document.querySelector('#visualizador-fotos');
const identificadorEvento = new URLSearchParams(location.search).get('id');
const formatoData = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Sao_Paulo' });

function criarElemento(tipo, classe, texto) {
  const elemento = document.createElement(tipo);
  if (classe) elemento.className = classe;
  if (texto) elemento.textContent = texto;
  return elemento;
}

function criarImagem(url, textoAlternativo) {
  const imagem = document.createElement('img');
  imagem.src = url;
  imagem.alt = textoAlternativo;
  imagem.loading = 'lazy';
  return imagem;
}

function exibirEstado(titulo, texto = '', tentarNovamente = false) {
  quadroEventos.hidden = false;
  estadoPagina.textContent = titulo;
  complementoPagina.textContent = texto;
  complementoPagina.hidden = !texto;
  botaoTentar.hidden = !tentarNovamente;
}

function exibirLista(eventos) {
  contagem.textContent = eventos.length === 1 ? '1 evento' : eventos.length + ' eventos';
  contagem.hidden = false;
  if (!eventos.length) {
    exibirEstado('Ainda não há eventos publicados.', 'Quando houver novos registros, as fotos e os detalhes aparecerão aqui.');
    return;
  }

  quadroEventos.hidden = true;
  conteudoPagina.className = 'grade-eventos';
  for (const evento of eventos) {
    const cartao = criarElemento('article', 'cartao-evento');
    const link = criarElemento('a', 'link-evento');
    link.href = 'eventos.html?id=' + encodeURIComponent(evento.id);

    const capa = criarElemento('div', 'capa-cartao-evento');
    capa.append(evento.capa ? criarImagem(evento.capa, '') : criarElemento('span', 'selo-cartao', 'RAME'));
    const corpo = criarElemento('div', 'corpo-cartao-evento');
    const data = criarElemento('time', 'selo-eventos', formatoData.format(new Date(evento.criado_em)));
    data.dateTime = evento.criado_em;
    const resumo = evento.descricao.length > 150 ? evento.descricao.slice(0, 150) + '…' : evento.descricao;
    corpo.append(data, criarElemento('h3', '', evento.titulo), criarElemento('p', '', resumo),
      criarElemento('span', 'abrir-evento', 'Ver evento →'));

    link.append(capa, corpo);
    cartao.append(link);
    conteudoPagina.append(cartao);
  }
}

function exibirDetalhes(evento) {
  quadroEventos.hidden = true;
  tituloPagina.textContent = evento.titulo;
  document.title = evento.titulo + ' | Rame Seishin Jutsu';
  document.querySelector('#selo-eventos').textContent = 'REGISTRO DO DOJO';
  document.querySelector('#introducao-eventos').textContent = 'Publicado em ' + formatoData.format(new Date(evento.criado_em));
  tituloAcervo.textContent = 'Sobre o evento';
  conteudoPagina.append(criarElemento('p', 'descricao-evento', evento.descricao));
  if (!evento.fotos.length) {
    conteudoPagina.append(criarElemento('p', 'descricao-evento', 'Este evento ainda não tem fotos.'));
    return;
  }

  const galeria = criarElemento('div', 'grade-eventos');
  evento.fotos.forEach((url, posicao) => {
    const legenda = 'Foto ' + (posicao + 1) + ' de ' + evento.fotos.length;
    const botao = criarElemento('button', 'miniatura-evento');
    botao.type = 'button';
    botao.setAttribute('aria-label', 'Ampliar ' + legenda.toLowerCase());
    botao.append(criarImagem(url, ''));
    botao.addEventListener('click', () => {
      const fotoAmpliada = document.querySelector('#foto-ampliada');
      fotoAmpliada.src = url;
      fotoAmpliada.alt = legenda + ' do evento ' + evento.titulo;
      document.querySelector('#legenda-visualizador').textContent = legenda;
      visualizador.showModal();
    });
    galeria.append(botao);
  });
  conteudoPagina.append(criarElemento('h3', 'titulo-galeria', 'Galeria de fotos'), galeria);
}

async function carregarPagina() {
  conteudoPagina.setAttribute('aria-busy', 'true');
  exibirEstado('Carregando eventos…');
  const caminho = identificadorEvento ? '/eventos/' + encodeURIComponent(identificadorEvento) : '/eventos';
  if (identificadorEvento) document.querySelector('#voltar-eventos').hidden = false;

  try {
    const resposta = await fetch(origemApi + '/api' + caminho, { signal: AbortSignal.timeout(90_000) });
    if (resposta.status === 404 && identificadorEvento) {
      exibirEstado('Evento não encontrado.', 'Volte à lista para conferir os registros disponíveis.');
      return;
    }
    if (!resposta.ok) throw new Error('Resposta inválida da API');
    const resultado = await resposta.json();
    if (identificadorEvento) exibirDetalhes(resultado);
    else exibirLista(resultado);
  } catch {
    exibirEstado('Os eventos estão indisponíveis agora.', 'Tente abrir a página novamente em instantes.', true);
  } finally {
    conteudoPagina.setAttribute('aria-busy', 'false');
  }
}

botaoTentar.addEventListener('click', carregarPagina);
carregarPagina();
