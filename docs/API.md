# API HTTP

Fonte: `backend/rotas/api.js`, montada em `/api` por `backend/servidor.js`.

## Rotas públicas

| Método | Caminho | Resultado |
| --- | --- | --- |
| GET | `/api/saude` | Estado do processo, sem testar dependências |
| GET | `/api/eventos` | Eventos |
| GET | `/api/eventos/:identificador` | Evento por UUID |
| GET | `/api/fotos-site` | Fotos institucionais |

Exemplo de leitura em backend local configurado: `curl http://localhost:3000/api/eventos`.

## Autenticação e painel

O painel está em `/admin`. O login recebe JSON `nome`/`senha` e estabelece cookie `rame_admin`, restrito a `/api/admin`, HTTP-only, SameSite Strict e Secure em `NODE_ENV=production`. O token é verificado com Supabase Auth em cada acesso protegido. Não há refresh token no cookie; após expiração é necessário novo login.

Métodos mutáveis exigem `X-Painel-Rame: 1`; se `Sec-Fetch-Site` é informado, deve ser `same-origin`. O cabeçalho não substitui autenticação.

| Método | Caminho após `/api/admin` | Permissão |
| --- | --- | --- |
| POST | `/entrar` | Público, com limite de tentativas |
| POST | `/sair` | Limpa cookie |
| GET | `/sessao` | Administrador |
| PATCH | `/senha` | Administrador; `senhaAtual`, `novaSenha` |
| POST | `/administradores` | Administrador; `nome`, `senha` |
| GET | `/administradores` | Principal |
| PATCH | `/administradores/:identificador/senha` | Principal; `novaSenha` |
| DELETE | `/administradores/:identificador` | Principal |
| POST | `/eventos` | Administrador; multipart |
| PUT | `/eventos/:identificador` | Administrador; multipart e versão |
| DELETE | `/eventos/:identificador` | Administrador |
| PUT | `/fotos-site/:identificador` | Administrador; multipart `foto` |
| DELETE | `/fotos-site/:identificador` | Administrador; restaura foto |

Criação/edição recebem `titulo`, `descricao` e upload `fotos`. Edição exige `versao` e `manterFotos` (string JSON com índices de fotos preservadas); exclusão de evento exige JSON com `versao`. O contrato completo de edição está no controlador de eventos e em `backend/views/assets/admin.js`; confira os campos antes de implementar outro cliente. Não confundir limite por envio com total por evento.

Retornos incluem 401 (sessão), 403 (permissão/origem), 404 (recurso), 409 (versão) e 429 (limite). Não foram realizadas ações remotas de escrita nesta revisão.
