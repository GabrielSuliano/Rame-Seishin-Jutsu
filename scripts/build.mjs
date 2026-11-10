import { cp, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const origem = 'src';
const destino = 'dist';
const paginas = join(origem, 'paginas');

await rm(destino, { recursive: true, force: true });
await mkdir(destino, { recursive: true });

const arquivosPagina = await readdir(paginas);

await Promise.all(
  arquivosPagina
    .filter((arquivo) => extname(arquivo) === '.html')
    .map((arquivo) => cp(join(paginas, arquivo), join(destino, arquivo)))
);

await Promise.all(
  ['css', 'js', 'imagens'].map((pasta) =>
    cp(join(origem, pasta), join(destino, pasta), { recursive: true })
  )
);

await cp(join(origem, 'imagens', 'favicon.ico'), join(destino, 'favicon.ico'));

const urlBackend = process.env.URL_BACKEND_PUBLICO?.trim();
if (urlBackend) {
  const origemBackend = new URL(urlBackend).origin;
  await writeFile(join(destino, 'js', 'configuracao-api.js'),
    `export const origemApi = ${JSON.stringify(origemBackend)};\n`);
}

console.log('Build estatico gerado em dist/');
