const { randomUUID } = require('node:crypto');
const sharp = require('sharp');
const { supabaseServidor } = require('../configuracao/supabase');

const armazenamento = supabaseServidor.storage.from('fotos-rame');
const identificadoresFotosSite = ['foto1', 'foto2', 'foto3', 'foto4'];
const formatosPermitidos = ['jpeg', 'png', 'webp'];

async function armazenarFoto(arquivo, pasta) {
  let imagemConvertida;
  try {
    const imagem = sharp(arquivo.buffer, { limitInputPixels: 25_000_000 });
    const metadados = await imagem.metadata();
    if (!formatosPermitidos.includes(metadados.format)) throw new Error('Formato inválido');
    imagemConvertida = await imagem.rotate().resize(1920, 1920, {
      fit: 'inside',
      withoutEnlargement: true
    }).webp({ quality: 84 }).toBuffer();
  } catch {
    throw Object.assign(new Error('Envie uma foto válida em JPG, PNG ou WebP de até 25 megapixels.'), { status: 400 });
  }

  const caminho = pasta + '/' + randomUUID() + '.webp';
  const { error: erro } = await armazenamento.upload(caminho, imagemConvertida, {
    contentType: 'image/webp',
    cacheControl: '86400'
  });
  if (erro) throw erro;
  return caminho;
}

async function removerArquivos(caminhos) {
  if (!caminhos.length) return;
  try {
    const { error: erro } = await armazenamento.remove(caminhos);
    if (erro) console.error('Não foi possível limpar fotos do Storage:', erro.message);
  } catch (erro) {
    console.error('Não foi possível limpar fotos do Storage:', erro.message);
  }
}

async function armazenarFotos(arquivos, pasta) {
  const caminhos = [];
  try {
    for (const arquivo of arquivos) caminhos.push(await armazenarFoto(arquivo, pasta));
    return caminhos;
  } catch (erro) {
    await removerArquivos(caminhos);
    throw erro;
  }
}

function obterUrlFoto(caminho) {
  return armazenamento.getPublicUrl(caminho).data.publicUrl;
}

async function listarFotosSite() {
  const { data: fotos, error: erro } = await supabaseServidor.from('fotos_site').select('identificador,caminho');
  if (erro) throw erro;
  return Object.fromEntries(fotos.map(({ identificador, caminho }) => [identificador, obterUrlFoto(caminho)]));
}

async function atualizarFotoSite(identificador, arquivo) {
  const tabela = supabaseServidor.from('fotos_site');
  const { data: fotoAnterior, error: erroConsulta } = await tabela.select('caminho').eq('identificador', identificador).maybeSingle();
  if (erroConsulta) throw erroConsulta;

  const caminho = arquivo ? await armazenarFoto(arquivo, 'site') : null;
  if (!fotoAnterior && !caminho) return;

  const operacao = fotoAnterior
    ? (caminho ? tabela.update({ caminho }) : tabela.delete()).eq('identificador', identificador).eq('caminho', fotoAnterior.caminho)
    : tabela.insert({ identificador, caminho });

  const { data: alteracao, error: erroAlteracao } = await operacao.select('identificador').maybeSingle();
  if (erroAlteracao && erroAlteracao.code !== '23505') throw erroAlteracao;
  if (!alteracao) {
    await removerArquivos(caminho ? [caminho] : []);
    throw Object.assign(new Error('A foto foi alterada em outra sessão. Atualize a página.'), { status: 409 });
  }
  if (fotoAnterior) await removerArquivos([fotoAnterior.caminho]);
}

module.exports = { identificadoresFotosSite, armazenarFotos, removerArquivos, obterUrlFoto, listarFotosSite, atualizarFotoSite };
