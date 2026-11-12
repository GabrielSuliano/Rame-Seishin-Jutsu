const express = require('express');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const { join } = require('node:path');
const rotasApi = require('./rotas/api');

const aplicacao = express();
const porta = Number(process.env.PORT || 3000);

aplicacao.disable('x-powered-by');
aplicacao.set('json escape', true);
if (process.env.RENDER === 'true' || process.env.NF_DEPLOYMENT_SHA) aplicacao.set('trust proxy', 1);

aplicacao.use((requisicao, resposta, proximo) => {
  resposta.set('X-Content-Type-Options', 'nosniff');
  proximo();
});
aplicacao.use('/api', express.json({ limit: '20kb' }), cookieParser(), rotasApi);
aplicacao.get('/admin', (requisicao, resposta) => {
  resposta.set({
    'Cache-Control': 'no-store',
    'Content-Security-Policy': "default-src 'self'; img-src 'self' https:; base-uri 'none'; frame-ancestors 'none'; form-action 'self'",
    'Referrer-Policy': 'same-origin',
    'X-Frame-Options': 'DENY',
    'X-Robots-Tag': 'noindex'
  }).sendFile(join(__dirname, 'views', 'admin.html'));
});
aplicacao.use('/painel-assets', express.static(join(__dirname, 'views', 'assets')));
aplicacao.use(express.static(join(__dirname, '..', 'dist')));

aplicacao.use((erro, requisicao, resposta, proximo) => {
  if (resposta.headersSent) return proximo(erro);
  if (erro instanceof multer.MulterError) {
    return resposta.status(400).json({ mensagem: 'Envie até 4 fotos por vez, de no máximo 6 MB cada.' });
  }
  if (erro.expor === true && [400, 404, 409].includes(erro.status)) {
    return resposta.status(erro.status).json({ mensagem: erro.message });
  }
  if (erro.type === 'entity.parse.failed' || erro.type === 'entity.too.large') {
    return resposta.status(erro.status).json({ mensagem: 'Dados inválidos ou acima do limite.' });
  }
  console.error('Falha na API:', erro.code || erro.name, erro.status || 'sem status');
  resposta.status(500).json({ mensagem: 'Não foi possível concluir a operação. Tente novamente.' });
});

if (require.main === module) {
  aplicacao.listen(porta, '0.0.0.0', () => console.log('Servidor disponível na porta ' + porta));
}

module.exports = aplicacao;
