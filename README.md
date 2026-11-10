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

## Eventos e administração

A API usa Node.js 24, Express, CommonJS e MVC. O Supabase hospeda o banco, a autenticação e as fotos. Os eventos ficam disponíveis em `/eventos.html` e o painel em `/admin` no servidor Node.

1. Aplique os arquivos em `supabase/migrations/` na ordem dos nomes.
2. Em Authentication → Users, crie e confirme a conta interna `admin@rame.example.com`. Escolha a senha nessa tela. No painel, entre com `admin` e a senha escolhida.
3. Copie `backend/.env.example` para `backend/.env` no ambiente local e preencha a URL, a chave publicável e a chave secreta do Supabase. A chave secreta é exclusiva do servidor.
4. Rode `npm ci --prefix backend`, `npm run build` e `npm start --prefix backend`. Abra `http://localhost:3000/admin`.

No Render, selecione um Web Service Free com os comandos e variáveis definidos em `render.yaml`. O servidor entrega a API, o painel e o site. O comando em `vercel.json` gera o site público com `URL_BACKEND_PUBLICO` apontando para a API no Render.

O administrador pode publicar, editar e excluir eventos, substituir ou restaurar as quatro fotos usadas nas páginas do site e alterar a senha. As fotos de eventos são públicas e podem ser abertas em tamanho maior. Cada evento aceita até 24 fotos, com até 4 por envio e 6 MB por arquivo.

A conta principal `admin` pode cadastrar outros administradores no painel. Cada pessoa entra com o nome cadastrado e a própria senha.
Para usar uma conta existente do Supabase como `admin`, defina `ID_ADMIN_PRINCIPAL` com o UID dela em Authentication → Users. Ela precisa estar confirmada.
