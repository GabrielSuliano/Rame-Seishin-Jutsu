# Rame Seishin Jutsu

Site institucional estatico sobre Rame Seishin Jutsu, organizado em paginas HTML, CSS e JavaScript puro. O projeto foi estruturado para apresentar historia, fundamentos, mestres, contato e conteudos complementares, com build simples para deploy na Vercel.

## Recursos

- Pagina inicial com apresentacao do tema.
- Paginas internas para historia, fundamentos, mestres, sobre e contato.
- CSS separado por pagina, com uma base compartilhada.
- JavaScript modular por area do site.
- Pasta de imagens com fotos, favicon e assets de marca.
- Script de build que gera a pasta `dist/` para publicacao.

## Stack

- HTML5
- CSS3
- JavaScript
- Node.js 18+ apenas para o script de build
- Vercel para deploy estatico

## Estrutura

```text
.
├── src/
│   ├── paginas/      # Arquivos HTML
│   ├── css/          # Estilos por pagina e base compartilhada
│   ├── js/           # Scripts do site
│   └── imagens/      # Fotos, favicon e imagens do projeto
├── scripts/
│   └── build.mjs     # Copia os arquivos para dist/
├── vercel.json
└── package.json
```

## Como rodar localmente

Por ser um site estatico, basta abrir os arquivos de `src/paginas/` no navegador ou servir a pasta com uma extensao como Live Server.

## Build

```bash
npm install
npm run build
```

O comando recria a pasta `dist/` com HTML, CSS, JS e imagens prontos para deploy.

## Deploy na Vercel

Configuracao recomendada:

- Framework Preset: `Other`
- Build Command: `npm run build`
- Output Directory: `dist`

## Status

Projeto front-end estatico pronto para publicacao e manutencao de conteudo.
