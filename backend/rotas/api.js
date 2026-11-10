const express = require('express');
const multer = require('multer');
const { rateLimit } = require('express-rate-limit');
const autenticacao = require('../controladores/autenticacao');
const eventos = require('../controladores/eventos');
const fotos = require('../controladores/fotos');

const roteador = express.Router();
const rotasPublicas = express.Router();
const rotasAdmin = express.Router();
const recepcaoFotos = multer({
  limits: { fileSize: 6 * 1024 * 1024, files: 4, fields: 4, fieldSize: 20 * 1024, parts: 9 }
});
const limitarTentativas = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { mensagem: 'Muitas tentativas. Aguarde alguns minutos.' }
});
const limitarUploads = rateLimit({
  windowMs: 60 * 1000,
  limit: 12,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { mensagem: 'Muitos envios. Aguarde um minuto.' }
});

function exigirRequisicaoDoPainel(requisicao, resposta, proximo) {
  resposta.set('Cache-Control', 'no-store');
  const origemNavegador = requisicao.get('Sec-Fetch-Site');
  if (!['GET', 'HEAD'].includes(requisicao.method) &&
      (requisicao.get('X-Painel-Rame') !== '1' || (origemNavegador && origemNavegador !== 'same-origin'))) {
    return resposta.status(403).json({ mensagem: 'Requisição externa bloqueada.' });
  }
  proximo();
}

function validarIdentificadorEvento(requisicao, resposta, proximo) {
  if (!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(requisicao.params.identificador)) {
    return resposta.status(404).json({ mensagem: 'Evento não encontrado.' });
  }
  proximo();
}

rotasPublicas.use((requisicao, resposta, proximo) => {
  resposta.set('Access-Control-Allow-Origin', '*');
  proximo();
});
rotasPublicas.get('/eventos', eventos.listar);
rotasPublicas.get('/eventos/:identificador', validarIdentificadorEvento, eventos.detalhar);
rotasPublicas.get('/fotos-site', fotos.listar);

rotasAdmin.use(exigirRequisicaoDoPainel);
rotasAdmin.post('/entrar', limitarTentativas, autenticacao.entrar);
rotasAdmin.post('/sair', autenticacao.sair);
rotasAdmin.use(autenticacao.exigirAdministrador);
rotasAdmin.get('/sessao', autenticacao.sessao);
rotasAdmin.get('/administradores', autenticacao.exigirAdministradorPrincipal, autenticacao.listarContas);
rotasAdmin.post('/administradores', autenticacao.exigirAdministradorPrincipal, limitarTentativas, autenticacao.criarConta);
rotasAdmin.patch('/administradores/:identificador/senha', autenticacao.exigirAdministradorPrincipal, limitarTentativas, autenticacao.redefinirSenhaConta);
rotasAdmin.delete('/administradores/:identificador', autenticacao.exigirAdministradorPrincipal, autenticacao.excluirConta);
rotasAdmin.patch('/senha', limitarTentativas, autenticacao.alterarSenha);
rotasAdmin.post('/eventos', limitarUploads, recepcaoFotos.array('fotos', 4), eventos.salvar);
rotasAdmin.put('/eventos/:identificador', validarIdentificadorEvento, limitarUploads, recepcaoFotos.array('fotos', 4), eventos.salvar);
rotasAdmin.delete('/eventos/:identificador', validarIdentificadorEvento, eventos.excluir);
rotasAdmin.put('/fotos-site/:identificador', limitarUploads, recepcaoFotos.single('foto'), fotos.atualizar);
rotasAdmin.delete('/fotos-site/:identificador', fotos.atualizar);

roteador.get('/saude', (requisicao, resposta) => resposta.json({ status: 'ok' }));
roteador.use('/admin', rotasAdmin);
roteador.use(rotasPublicas);
roteador.use((requisicao, resposta) => resposta.status(404).json({ mensagem: 'Rota não encontrada.' }));

module.exports = roteador;
