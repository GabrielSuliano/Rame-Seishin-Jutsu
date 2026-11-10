const { supabaseServidor } = require('../configuracao/supabase');
const { obterUrlFoto } = require('./fotos');

const camposEvento = 'id,titulo,descricao,fotos,versao,criado_em';

function apresentarEvento(evento) {
  return { ...evento, fotos: evento.fotos.map(obterUrlFoto) };
}

async function listarEventos() {
  const { data: eventos, error: erro } = await supabaseServidor.from('eventos').select(camposEvento)
    .order('criado_em', { ascending: false }).order('id');
  if (erro) throw erro;
  return eventos;
}

async function buscarEvento(identificador) {
  const { data: evento, error: erro } = await supabaseServidor.from('eventos').select(camposEvento)
    .eq('id', identificador).maybeSingle();
  if (erro) throw erro;
  if (!evento) throw Object.assign(new Error('Evento não encontrado.'), { status: 404, expor: true });
  return evento;
}

async function salvarEvento(dadosEvento, eventoAnterior) {
  const tabela = supabaseServidor.from('eventos');
  const operacao = eventoAnterior
    ? tabela.update({ ...dadosEvento, versao: eventoAnterior.versao + 1 }).eq('id', eventoAnterior.id).eq('versao', eventoAnterior.versao)
    : tabela.insert(dadosEvento);
  const { data: evento, error: erro } = await operacao.select(camposEvento).maybeSingle();
  if (erro) throw erro;
  return evento;
}

async function excluirEvento(evento) {
  const { data: excluido, error: erro } = await supabaseServidor.from('eventos').delete()
    .eq('id', evento.id).eq('versao', evento.versao).select('id').maybeSingle();
  if (erro) throw erro;
  return excluido;
}

module.exports = { apresentarEvento, listarEventos, buscarEvento, salvarEvento, excluirEvento };
