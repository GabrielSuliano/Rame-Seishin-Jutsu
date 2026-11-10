const { criarClienteAutenticacao, emailAdministrador, nomeAdministrador } = require('../configuracao/supabase');

const nomeCookie = 'rame_admin';
const opcoesCookie = { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', path: '/api/admin' };

async function entrar(requisicao, resposta) {
  const { nome, senha } = requisicao.body || {};
  if (typeof nome !== 'string' || typeof senha !== 'string' || nome.trim().toLowerCase() !== nomeAdministrador || senha.length > 256) {
    return resposta.status(401).json({ mensagem: 'Nome de usuário ou senha inválidos.' });
  }

  const clienteAutenticacao = criarClienteAutenticacao();
  const { data, error: erro } = await clienteAutenticacao.auth.signInWithPassword({ email: emailAdministrador, password: senha });
  if (erro?.status === 429) return resposta.status(429).json({ mensagem: 'Muitas tentativas. Aguarde e tente novamente.' });
  if (erro && erro.status >= 500) throw erro;
  if (!data?.session) return resposta.status(401).json({ mensagem: 'Nome de usuário ou senha inválidos.' });

  resposta.cookie(nomeCookie, data.session.access_token, {
    ...opcoesCookie,
    maxAge: data.session.expires_in * 1000
  }).sendStatus(204);
}

async function exigirAdministrador(requisicao, resposta, proximo) {
  const tokenAcesso = requisicao.cookies[nomeCookie];
  if (!tokenAcesso) return resposta.status(401).json({ mensagem: 'Entre no painel para continuar.' });

  const clienteAutenticacao = criarClienteAutenticacao();
  const { data, error: erro } = await clienteAutenticacao.auth.getUser(tokenAcesso);
  if (erro?.status >= 500) throw erro;
  if (!data?.user?.email_confirmed_at || data.user.email?.toLowerCase() !== emailAdministrador) {
    return resposta.clearCookie(nomeCookie, opcoesCookie).status(401).json({ mensagem: 'Sessão inválida ou expirada.' });
  }
  requisicao.tokenAcesso = tokenAcesso;
  proximo();
}

function sair(requisicao, resposta) {
  resposta.clearCookie(nomeCookie, opcoesCookie).sendStatus(204);
}

async function alterarSenha(requisicao, resposta) {
  const { senhaAtual, novaSenha } = requisicao.body || {};
  if (typeof senhaAtual !== 'string' || senhaAtual.length > 256 ||
      typeof novaSenha !== 'string' || novaSenha.length < 12 || Buffer.byteLength(novaSenha) > 72 ||
      senhaAtual === novaSenha) {
    return resposta.status(400).json({ mensagem: 'Escolha uma senha diferente, com pelo menos 12 caracteres e até 72 bytes.' });
  }

  const clienteAutenticacao = criarClienteAutenticacao();
  const { error: erroLogin } = await clienteAutenticacao.auth.signInWithPassword({
    email: emailAdministrador, password: senhaAtual
  });
  if (erroLogin?.status === 429) return resposta.status(429).json({ mensagem: 'Muitas tentativas. Aguarde e tente novamente.' });
  if (erroLogin?.status >= 500) throw erroLogin;
  if (erroLogin) return resposta.status(400).json({ mensagem: 'Senha atual incorreta.' });

  const { error: erroSenha } = await clienteAutenticacao.auth.updateUser({
    current_password: senhaAtual,
    password: novaSenha
  });
  if (erroSenha?.status >= 500) throw erroSenha;
  if (erroSenha) {
    await clienteAutenticacao.auth.signOut({ scope: 'local' });
    return resposta.status(400).json({ mensagem: 'O Supabase recusou a nova senha. Escolha outra senha.' });
  }

  await clienteAutenticacao.auth.signOut({ scope: 'global' });
  sair(requisicao, resposta);
}

module.exports = { entrar, sair, exigirAdministrador, alterarSenha };
