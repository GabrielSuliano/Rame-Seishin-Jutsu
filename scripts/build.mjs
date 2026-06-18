import { cp, mkdir, readdir, rm } from 'node:fs/promises';
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

console.log('Build estatico gerado em dist/');
