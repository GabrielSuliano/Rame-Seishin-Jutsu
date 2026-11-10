const eventos = require('../modelos/eventos');
const { armazenarFotos, removerArquivos, obterUrlFoto } = require('../modelos/fotos');

async function listar(requisicao, resposta) {
  const registros = await eventos.listarEventos();
  resposta.json(registros.map(({ id, titulo, descricao, fotos, criado_em }) => ({
    id, titulo, descricao, criado_em, capa: fotos.length ? obterUrlFoto(fotos[0]) : null
  })));
}

async function detalhar(requisicao, resposta) {
  resposta.json(eventos.apresentarEvento(await eventos.buscarEvento(requisicao.params.identificador)));
}

function validarVersao(versaoRecebida, evento) {
  if (versaoRecebida !== evento.versao && versaoRecebida !== String(evento.versao)) {
    throw Object.assign(new Error('O evento foi alterado em outra sessão. Atualize a página.'), { status: 409, expor: true });
  }
}

async function salvar(requisicao, resposta) {
  const { titulo, descricao, versao, manterFotos } = requisicao.body || {};
  const tituloFormatado = typeof titulo === 'string' ? titulo.normalize('NFC').trim() : '';
  const descricaoFormatada = typeof descricao === 'string' ? descricao.normalize('NFC').replace(/\r\n?/g, '\n').trim() : '';
  if (!tituloFormatado || tituloFormatado.length > 120 || !descricaoFormatada || descricaoFormatada.length > 4000) {
    return resposta.status(400).json({ mensagem: 'Preencha o título (até 120 caracteres) e a descrição (até 4.000).' });
  }
  if (/\p{Cc}/u.test(tituloFormatado) || /\p{Cc}/u.test(descricaoFormatada.replace(/[\t\n]/g, ''))) {
    return resposta.status(400).json({ mensagem: 'O título ou a descrição contém caracteres de controle inválidos.' });
  }

  const identificador = requisicao.params.identificador;
  const eventoAnterior = identificador ? await eventos.buscarEvento(identificador) : null;
  let fotosMantidas = [];

  if (eventoAnterior) {
    validarVersao(versao, eventoAnterior);
    if (typeof manterFotos !== 'string') {
      return resposta.status(400).json({ mensagem: 'Seleção de fotos inválida.' });
    }
    let posicoes;
    try {
      posicoes = JSON.parse(manterFotos);
    } catch {
      return resposta.status(400).json({ mensagem: 'Seleção de fotos inválida.' });
    }
    if (!Array.isArray(posicoes) || new Set(posicoes).size !== posicoes.length ||
        posicoes.some((posicao) => !Number.isInteger(posicao) || posicao < 0 || posicao >= eventoAnterior.fotos.length)) {
      return resposta.status(400).json({ mensagem: 'Seleção de fotos inválida.' });
    }
    fotosMantidas = posicoes.map((posicao) => eventoAnterior.fotos[posicao]);
  }

  const arquivos = requisicao.files || [];
  if (fotosMantidas.length + arquivos.length > 24) {
    return resposta.status(400).json({ mensagem: 'O evento pode ter até 24 fotos.' });
  }

  const novasFotos = await armazenarFotos(arquivos, 'eventos');
  const evento = await eventos.salvarEvento({
    titulo: tituloFormatado, descricao: descricaoFormatada, fotos: [...fotosMantidas, ...novasFotos]
  }, eventoAnterior);

  if (!evento) {
    await removerArquivos(novasFotos);
    return resposta.status(409).json({ mensagem: 'O evento mudou durante a edição. Atualize a página.' });
  }
  if (eventoAnterior) await removerArquivos(eventoAnterior.fotos.filter((caminho) => !fotosMantidas.includes(caminho)));

  resposta.status(eventoAnterior ? 200 : 201).json(eventos.apresentarEvento(evento));
}

async function excluir(requisicao, resposta) {
  const evento = await eventos.buscarEvento(requisicao.params.identificador);
  validarVersao(requisicao.body?.versao, evento);
  const excluido = await eventos.excluirEvento(evento);
  if (!excluido) return resposta.status(409).json({ mensagem: 'O evento mudou durante a exclusão. Atualize a página.' });
  await removerArquivos(evento.fotos);
  resposta.sendStatus(204);
}

module.exports = { listar, detalhar, salvar, excluir };
