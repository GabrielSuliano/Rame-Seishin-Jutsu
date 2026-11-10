const { createClient } = require('@supabase/supabase-js');

const { SUPABASE_URL, SUPABASE_CHAVE_PUBLICA, SUPABASE_CHAVE_SECRETA, NOME_ADMIN } = process.env;
const nomeAdministrador = NOME_ADMIN?.trim().toLowerCase() || 'admin';
const emailAdministrador = 'admin@rame.example.com';
if (!/^[a-z0-9._-]{3,32}$/.test(nomeAdministrador)) {
  throw new Error('NOME_ADMIN precisa ter 3 a 32 caracteres: letras, números, ponto, hífen ou sublinhado.');
}

if (!SUPABASE_URL || !SUPABASE_CHAVE_PUBLICA || !SUPABASE_CHAVE_SECRETA) {
  throw new Error('Configure a URL, as duas chaves do Supabase do projeto.');
}

const opcoesCliente = { auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false } };
const supabaseServidor = createClient(SUPABASE_URL, SUPABASE_CHAVE_SECRETA, opcoesCliente);

function criarClienteAutenticacao() {
  return createClient(SUPABASE_URL, SUPABASE_CHAVE_PUBLICA, opcoesCliente);
}

module.exports = { supabaseServidor, criarClienteAutenticacao, emailAdministrador, nomeAdministrador };
