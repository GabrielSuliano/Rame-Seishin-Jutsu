const { randomUUID } = require('node:crypto');
const { supabaseServidor } = require('../configuracao/supabase');

const emailAdministradorPrincipal = 'admin@rame.example.com';
const idAdministradorPrincipal = process.env.ID_ADMIN_PRINCIPAL?.trim();

function normalizarNome(nome) {
  return nome.normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('pt-BR');
}

async function buscarAdministrador(campo, valor) {
  const { data: administrador, error: erro } = await supabaseServidor.from('administradores')
    .select('id,nome').eq(campo, valor).maybeSingle();
  if (erro) throw erro;
  return administrador;
}

async function buscarEmailPorId(identificador) {
  const { data: dadosAutenticacao, error: erro } = await supabaseServidor.auth.admin.getUserById(identificador);
  if (erro) throw erro;
  return dadosAutenticacao.user?.email;
}

async function obterEmailDeAcesso(nomeNormalizado) {
  if (nomeNormalizado === 'admin') {
    return idAdministradorPrincipal ? buscarEmailPorId(idAdministradorPrincipal) : emailAdministradorPrincipal;
  }

  const administrador = await buscarAdministrador('nome_normalizado', nomeNormalizado);
  return administrador ? buscarEmailPorId(administrador.id) : null;
}

async function identificarAdministrador(usuario) {
  if (!usuario?.email_confirmed_at) return null;
  const contaPrincipal = idAdministradorPrincipal ? usuario.id === idAdministradorPrincipal : usuario.email === emailAdministradorPrincipal;
  if (contaPrincipal) return { nome: 'admin', principal: true };
  const administrador = await buscarAdministrador('id', usuario.id);
  return administrador && { nome: administrador.nome, principal: false };
}

async function listarAdministradores() {
  const { data: administradores, error: erro } = await supabaseServidor.from('administradores')
    .select('id,nome,criado_em').order('criado_em');
  if (erro) throw erro;
  return administradores;
}

async function criarAdministrador(nome, nomeNormalizado, senha) {
  if (await buscarAdministrador('nome_normalizado', nomeNormalizado)) return null;

  const emailInterno = randomUUID() + '@rame.example.com';
  const { data: dadosAutenticacao, error: erroAutenticacao } = await supabaseServidor.auth.admin.createUser({
    email: emailInterno,
    password: senha,
    email_confirm: true
  });
  if (erroAutenticacao) throw erroAutenticacao;

  const identificador = dadosAutenticacao.user.id;
  const { data: administrador, error: erroCadastro } = await supabaseServidor.from('administradores')
    .insert({ id: identificador, nome, nome_normalizado: nomeNormalizado })
    .select('id,nome,criado_em').single();

  if (!erroCadastro) return administrador;
  // Falhas de transporte podem ocorrer depois de o banco ter gravado a conta.
  if (erroCadastro.code === '23505') {
    const { error: erroLimpeza } = await supabaseServidor.auth.admin.deleteUser(identificador);
    if (erroLimpeza) console.error('Não foi possível limpar uma conta duplicada:', erroLimpeza.message);
    return null;
  }
  throw erroCadastro;
}

async function buscarAdministradorGerenciavel(identificador) {
  if (!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(identificador) || identificador.toLowerCase() === idAdministradorPrincipal?.toLowerCase()) {
    return null;
  }
  return buscarAdministrador('id', identificador);
}

async function redefinirSenha(identificador, senha) {
  const administrador = await buscarAdministradorGerenciavel(identificador);
  if (!administrador) return false;

  const { error: erro } = await supabaseServidor.auth.admin.updateUserById(administrador.id, { password: senha });
  if (erro?.status === 404) return false;
  if (erro) throw erro;
  return true;
}

async function excluirAdministrador(identificador) {
  const administrador = await buscarAdministradorGerenciavel(identificador);
  if (!administrador) return false;

  // O cadastro vinculado em public.administradores é removido pelo ON DELETE CASCADE.
  const { error: erro } = await supabaseServidor.auth.admin.deleteUser(administrador.id);
  if (erro?.status === 404) return false;
  if (erro) throw erro;
  return true;
}

module.exports = {
  normalizarNome, obterEmailDeAcesso, identificarAdministrador, listarAdministradores,
  criarAdministrador, redefinirSenha, excluirAdministrador
};
