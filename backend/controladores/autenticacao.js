const { criarClienteAutenticacao } = require('../configuracao/supabase');
const administradores = require('../modelos/administradores');

const nomeCookie = 'rame_admin';
const opcoesCookie = { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', path: '/api/admin' };

function senhaValida(senha) {
  return typeof senha === 'string' && senha.length >= 8 && Buffer.byteLength(senha) <= 72;
}

async function entrar(requisicao, resposta) {
  const { nome, senha } = requisicao.body || {};
  const nomeNormalizado = typeof nome === 'string' && nome.length <= 120 ? administradores.normalizarNome(nome) : '';
  const email = nomeNormalizado && typeof senha === 'string' && senha.length <= 256
    ? await administradores.obterEmailDeAcesso(nomeNormalizado)
    : null;
  if (!email) return resposta.status(401).json({ mensagem: 'Nome ou senha inválidos.' });

  const clienteAutenticacao = criarClienteAutenticacao();
  const { data: dadosAutenticacao, error: erro } = await clienteAutenticacao.auth.signInWithPassword({ email, password: senha });
  if (erro?.status === 429) return resposta.status(429).json({ mensagem: 'Muitas tentativas. Aguarde e tente novamente.' });
  if (erro && erro.status >= 500) throw erro;
  if (!dadosAutenticacao?.session) return resposta.status(401).json({ mensagem: 'Nome ou senha inválidos.' });

  resposta.cookie(nomeCookie, dadosAutenticacao.session.access_token, {
    ...opcoesCookie,
    maxAge: dadosAutenticacao.session.expires_in * 1000
  }).sendStatus(204);
}

async function exigirAdministrador(requisicao, resposta, proximo) {
  const tokenAcesso = requisicao.cookies[nomeCookie];
  if (!tokenAcesso) return resposta.status(401).json({ mensagem: 'Entre no painel para continuar.' });

  const clienteAutenticacao = criarClienteAutenticacao();
  const { data: dadosAutenticacao, error: erro } = await clienteAutenticacao.auth.getUser(tokenAcesso);
  if (erro?.status >= 500) throw erro;
  const usuario = dadosAutenticacao?.user;
  const administrador = await administradores.identificarAdministrador(usuario);
  if (!administrador) {
    return resposta.clearCookie(nomeCookie, opcoesCookie).status(401).json({ mensagem: 'Sessão inválida ou expirada.' });
  }

  requisicao.administrador = administrador;
  requisicao.emailInterno = usuario.email;
  proximo();
}

function exigirAdministradorPrincipal(requisicao, resposta, proximo) {
  if (!requisicao.administrador.principal) return resposta.status(403).json({ mensagem: 'Somente a conta admin pode cadastrar administradores.' });
  proximo();
}

function sessao(requisicao, resposta) {
  resposta.json(requisicao.administrador);
}

function sair(requisicao, resposta) {
  resposta.clearCookie(nomeCookie, opcoesCookie).sendStatus(204);
}

async function alterarSenha(requisicao, resposta) {
  const { senhaAtual, novaSenha } = requisicao.body || {};
  if (typeof senhaAtual !== 'string' || senhaAtual.length > 256 || !senhaValida(novaSenha) || senhaAtual === novaSenha) {
    return resposta.status(400).json({ mensagem: 'Escolha uma senha diferente, com pelo menos 8 caracteres e até 72 bytes.' });
  }

  const clienteAutenticacao = criarClienteAutenticacao();
  const { error: erroLogin } = await clienteAutenticacao.auth.signInWithPassword({
    email: requisicao.emailInterno, password: senhaAtual
  });
  if (erroLogin?.status === 429) return resposta.status(429).json({ mensagem: 'Muitas tentativas. Aguarde e tente novamente.' });
  if (erroLogin?.status >= 500) throw erroLogin;
  if (erroLogin) return resposta.status(400).json({ mensagem: 'Senha atual incorreta.' });

  const { error: erroSenha } = await clienteAutenticacao.auth.updateUser({ current_password: senhaAtual, password: novaSenha });
  if (erroSenha?.status >= 500) throw erroSenha;
  if (erroSenha) {
    await clienteAutenticacao.auth.signOut({ scope: 'local' });
    return resposta.status(400).json({ mensagem: 'O Supabase recusou a nova senha. Escolha outra senha.' });
  }

  await clienteAutenticacao.auth.signOut({ scope: 'global' });
  sair(requisicao, resposta);
}

async function listarContas(requisicao, resposta) {
  resposta.json(await administradores.listarAdministradores());
}

async function criarConta(requisicao, resposta) {
  const { nome, senha } = requisicao.body || {};
  const nomeFormatado = typeof nome === 'string' && nome.length <= 120 ? nome.normalize('NFKC').trim().replace(/\s+/g, ' ') : '';
  if (nomeFormatado.length < 2 || nomeFormatado.length > 60 || !/^[\p{L}\p{N}][\p{L}\p{M}\p{N} ._'-]*$/u.test(nomeFormatado)) {
    return resposta.status(400).json({ mensagem: 'Informe um nome válido com 2 a 60 caracteres.' });
  }
  if (!senhaValida(senha)) return resposta.status(400).json({ mensagem: 'Use uma senha com pelo menos 8 caracteres e até 72 bytes.' });

  const nomeNormalizado = administradores.normalizarNome(nomeFormatado);
  if (nomeNormalizado === 'admin') return resposta.status(409).json({ mensagem: 'Esse nome está reservado.' });

  const administrador = await administradores.criarAdministrador(nomeFormatado, nomeNormalizado, senha);
  if (!administrador) return resposta.status(409).json({ mensagem: 'Já existe um administrador com esse nome.' });
  resposta.status(201).json(administrador);
}

async function redefinirSenhaConta(requisicao, resposta) {
  const { novaSenha } = requisicao.body || {};
  if (!senhaValida(novaSenha)) return resposta.status(400).json({ mensagem: 'Use uma senha com pelo menos 8 caracteres e até 72 bytes.' });

  try {
    const alterado = await administradores.redefinirSenha(requisicao.params.identificador, novaSenha);
    if (!alterado) return resposta.status(404).json({ mensagem: 'Administrador não encontrado.' });
    resposta.sendStatus(204);
  } catch (erro) {
    if (erro.code !== 'weak_password') throw erro;
    resposta.status(400).json({ mensagem: 'O Supabase recusou a nova senha. Escolha outra senha.' });
  }
}

async function excluirConta(requisicao, resposta) {
  const excluido = await administradores.excluirAdministrador(requisicao.params.identificador);
  if (!excluido) return resposta.status(404).json({ mensagem: 'Administrador não encontrado.' });
  resposta.sendStatus(204);
}

module.exports = {
  entrar, sair, sessao, exigirAdministrador, exigirAdministradorPrincipal, alterarSenha,
  listarContas, criarConta, redefinirSenhaConta, excluirConta
};
