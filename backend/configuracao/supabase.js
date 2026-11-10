const { createClient } = require('@supabase/supabase-js');

const { SUPABASE_URL, SUPABASE_CHAVE_PUBLICA, SUPABASE_CHAVE_SECRETA } = process.env;

if (!SUPABASE_URL || !SUPABASE_CHAVE_PUBLICA || !SUPABASE_CHAVE_SECRETA) {
  throw new Error('Configure a URL, as duas chaves do Supabase do projeto.');
}

const opcoesCliente = { auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false } };
const supabaseServidor = createClient(SUPABASE_URL, SUPABASE_CHAVE_SECRETA, opcoesCliente);

function criarClienteAutenticacao() {
  return createClient(SUPABASE_URL, SUPABASE_CHAVE_PUBLICA, opcoesCliente);
}

module.exports = { supabaseServidor, criarClienteAutenticacao };
