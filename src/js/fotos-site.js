import { origemApi } from './configuracao-api.js';

async function carregarFotosSite() {
  try {
    const resposta = await fetch(origemApi + '/api/fotos-site', { signal: AbortSignal.timeout(90_000) });
    if (!resposta.ok) return;
    const fotos = await resposta.json();

    for (const identificador of ['foto1', 'foto2', 'foto3', 'foto4']) {
      if (!fotos[identificador]) continue;
      const url = new URL(fotos[identificador]);
      if (!['http:', 'https:'].includes(url.protocol)) continue;

      document.documentElement.style.setProperty('--' + identificador, 'url(' + JSON.stringify(url.href) + ')');
      document.querySelectorAll('img[src$="/' + identificador + '.png"]').forEach((imagem) => {
        imagem.src = url.href;
      });
    }
  } catch {
    // As imagens originais já estão no HTML e no CSS.
  }
}

carregarFotosSite();
