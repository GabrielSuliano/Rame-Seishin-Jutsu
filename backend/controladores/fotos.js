const fotos = require('../modelos/fotos');

async function listar(requisicao, resposta) {
  resposta.json(await fotos.listarFotosSite());
}

async function atualizar(requisicao, resposta) {
  const { identificador } = requisicao.params;
  if (!fotos.identificadoresFotosSite.includes(identificador)) {
    return resposta.status(404).json({ mensagem: 'Foto do site não encontrada.' });
  }
  if (requisicao.method === 'PUT' && !requisicao.file) {
    return resposta.status(400).json({ mensagem: 'Selecione a nova foto.' });
  }
  await fotos.atualizarFotoSite(identificador, requisicao.file);
  resposta.sendStatus(204);
}

module.exports = { listar, atualizar };
