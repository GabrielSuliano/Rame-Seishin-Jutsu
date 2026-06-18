# 📚 DOCUMENTAÇÃO FRONTEND - Rame Seishin Jutsu

**Data:** 10 de maio de 2026  
**Projeto:** Site Institucional - Rame Seishin Jutsu  
**Versão:** 1.0  
**Linguagem:** HTML5, CSS3, JavaScript (Vanilla)

---

## 📋 SUMÁRIO EXECUTIVO

Este documento contém toda a documentação técnica do frontend para integração com o backend. Inclui:
- Estrutura de páginas HTML
- Endpoints de API esperados
- Estrutura de dados JSON
- Validações de formulários
- Fluxos de autenticação
- IDs importantes dos elementos
- Configurações de ambiente

---

## 🏗️ ESTRUTURA DO PROJETO

```
site-organizado/
├── paginas/                    # Páginas HTML (7 páginas)
│   ├── index.html             # Homepage
│   ├── historia.html          # História do Rame
│   ├── sobre-o-rame.html      # Sobre a instituição
│   ├── mestres.html           # Tabela de mestres
│   ├── fundamentos.html       # Princípios fundamentais
│   ├── contato.html           # Formulário de contato
│   └── login.html             # Autenticação
├── css/                        # Arquivos de estilo (8 arquivos)
│   ├── base.css               # Estilos globais compartilhados
│   ├── index.css              # Estilos da homepage
│   ├── historia.css           # Estilos página história
│   ├── sobre-o-rame.css       # Estilos página sobre
│   ├── mestres.css            # Estilos página mestres
│   ├── fundamentos.css        # Estilos página fundamentos
│   ├── contato.css            # Estilos página contato
│   └── login.css              # Estilos página login
├── js/                         # Arquivos JavaScript (7 módulos)
│   ├── api.js                 # Camada de comunicação com API (centralizizada)
│   ├── index.js               # Interações homepage
│   ├── historia.js            # Interações página história
│   ├── sobre-o-rame.js        # (não existe, usa base)
│   ├── mestres.js             # Tabela com busca e ordenação
│   ├── fundamentos.js         # Abas e animações
│   ├── contato.js             # Validação de formulário
│   └── login.js               # Autenticação e sessão
└── imagens/                    # Pasta de assets (fora deste diretório)
```

---

## 🌐 CONFIGURAÇÃO DA API

### Base URL
```javascript
// Em: js/api.js (EDITAR CONFORME NECESSÁRIO)
CONFIG_API = {
  urlBase: 'http://localhost:3000/api',  // ← EDITAR PARA SUA URL
  timeoutMs: 10000,
  modoDebug: true  // Mostra logs no console
}
```

**Regra de CORS:** Todas as requisições usam método `fetch` com credenciais (cookies).

---

## 📄 PÁGINAS HTML - DETALHAMENTO

### 1. INDEX.HTML (Homepage)
**Caminho:** `paginas/index.html`  
**CSS:** `css/index.css`  
**JS:** `js/index.js`

#### Seções:
- **Hero:** Imagem de fundo, título, botões "Comece Agora" e "Saiba Mais"
- **Filosofia:** 2 cartões (Escuro, Vermelho) com descrição
- **Pilares:** Grade 4 colunas com 4 pilares do Rame
- **Academias:** Grade 3 colunas com academias dinâmicas (carregadas via API)
- **CTA Final:** Chamada para ação

#### Elementos Importantes:
```html
<!-- IDs para JavaScript -->
<div id="secao-academias">...</div>  <!-- Carregado dinamicamente -->
<button class="botao-primario">...</button>
```

#### Endpoints Chamados:
```javascript
GET /api/academias
Retorna: [{id, nome, descricao}, ...]
```

---

### 2. HISTORIA.HTML (História)
**Caminho:** `paginas/historia.html`  
**CSS:** `css/historia.css`  
**JS:** `js/historia.js`

#### Seções:
- **Hero:** "Dai Nippon Butoku Kai" - fundação
- **Conteúdo Editorial:** Texto + Kanji visual
- **Brasão:** Símbolo e descrição
- **Samurai:** Imagem + Bushidō 8 princípios em grade 4 colunas
- **Animações:** Fade-in ao scroll (IntersectionObserver)

#### Endpoint (futuro):
```javascript
GET /api/historia
Retorna: {conteudo, brasao, samurai_principios, ...}
```

---

### 3. SOBRE-O-RAME.HTML (Sobre)
**Caminho:** `paginas/sobre-o-rame.html`  
**CSS:** `css/sobre-o-rame.css`  
**JS:** Nenhum (estático)

#### Seções:
- **Filosofia:** 2 cartões (Escuro, Vermelho)
- **Pilares:** Grade 4 colunas (5º e 6º pilares)
- **Academias:** Grade 3 colunas com cards
- **CTA Final:** Chamada para ação

#### Dados Estáticos (hardcoded no HTML)
Não faz chamadas de API.

---

### 4. MESTRES.HTML (Tabela de Mestres)
**Caminho:** `paginas/mestres.html`  
**CSS:** `css/mestres.css`  
**JS:** `js/mestres.js`

#### Estrutura:
```html
<h1>RAME - Mestres e Professores</h1>

<!-- Filtro de busca -->
<input type="text" id="filtro-tabela" placeholder="Buscar por nome...">

<!-- Tabela -->
<table class="tabela-mestres">
  <thead>
    <tr>
      <th>Grau</th>
      <th>Nome</th>
      <th>Posição</th>
    </tr>
  </thead>
  <tbody id="corpo-tabela">
    <!-- Preenchido por JavaScript -->
  </tbody>
</table>
```

#### Endpoint Chamado:
```javascript
GET /api/mestres
Resposta Esperada: [
  {
    id: 1,
    grau: "HACHIDAN",          // HACHIDAN até SHODAN, "Dr.", "Srta."
    nome: "Nome do Mestre",
    posicao: "Presidente"      // ou outro cargo
  },
  ...
]
```

#### Funcionalidades JavaScript:
- ✅ Busca em tempo real (filtra linhas)
- ✅ Ordenação por coluna (click no header)
- ✅ Highlights de graus em vermelho

---

### 5. FUNDAMENTOS.HTML (Princípios)
**Caminho:** `paginas/fundamentos.html`  
**CSS:** `css/fundamentos.css`  
**JS:** `js/fundamentos.js`

#### Seções:
- **Fundamentos:** 4 cartões (2 escuro/vermelho, 2 cinza)
- **Áreas:** 4 itens (projeção, solo, striking, filosofia)
- **Caminho Shu-Ha-Ri:** 3 etapas de treinamento

#### Endpoint (futuro):
```javascript
GET /api/fundamentos
```

---

### 6. CONTATO.HTML (Formulário)
**Caminho:** `paginas/contato.html`  
**CSS:** `css/contato.css`  
**JS:** `js/contato.js`

#### Formulário:
```html
<form id="formulario-contato">
  <input type="text" name="nome" required>
  <input type="email" name="email" required>
  <input type="tel" name="telefone">
  <select name="academia">
    <option>Selecione uma academia...</option>
  </select>
  <textarea name="mensagem" required></textarea>
  <button type="submit" class="botao-enviar">Enviar Mensagem</button>
</form>
```

#### Validações (em tempo real):
- **Nome:** Min 3 caracteres, máx 100
- **Email:** Validação de formato
- **Telefone:** Apenas números e caracteres válidos
- **Mensagem:** Min 10 caracteres, máx 2000

#### Endpoint Chamado:
```javascript
POST /api/mensagens/enviar
Body: {
  nome: "João Silva",
  email: "joao@email.com",
  telefone: "(11) 99999-9999",
  academia: "São Paulo",
  mensagem: "Mensagem aqui..."
}

Response (sucesso): {
  sucesso: true,
  mensagem: "Mensagem enviada com sucesso"
}

Response (erro): {
  sucesso: false,
  erro: "Descrição do erro"
}
```

#### Informações de Contato (Aside):
```html
<aside>
  <div class="item-contato">
    <h3>Telefone</h3>
    <p>(11) 3000-0000</p>
  </div>
  <div class="item-contato">
    <h3>E-mail</h3>
    <p>contato@rame.com.br</p>
  </div>
  <div class="item-contato">
    <h3>Endereço</h3>
    <p>São Paulo - SP</p>
  </div>
</aside>
```

---

### 7. LOGIN.HTML (Autenticação)
**Caminho:** `paginas/login.html`  
**CSS:** `css/login.css`  
**JS:** `js/login.js`

#### Formulário:
```html
<form id="formulario-login">
  <input type="text" name="usuario" placeholder="Usuário ou CPF">
  <input type="password" name="senha" placeholder="Senha">
  <button type="submit" class="botao-confirmar">Confirmar</button>
  <button type="button" class="botao-cancelar" onclick="window.location='index.html'">Cancelar</button>
</form>
```

#### Endpoint Chamado:
```javascript
POST /api/auth/login
Body: {
  usuario: "cpf_ou_usuario",
  senha: "senha_criptografada"
}

Response (sucesso): {
  sucesso: true,
  usuario: {
    id: 1,
    nome: "João Silva",
    email: "joao@email.com",
    tipo: "maestro"  // maestro, aluno, administrador
  },
  token: "jwt_token_aqui"  // ou session cookie
}

Response (erro): {
  sucesso: false,
  erro: "Usuário ou senha inválidos"
}
```

#### Fluxo de Autenticação:
1. ✅ Usuário acessa `/paginas/login.html`
2. ✅ Verifica localStorage - se autenticado, redireciona para homepage
3. ✅ Submete formulário → POST `/api/auth/login`
4. ✅ Backend retorna token + dados usuário
5. ✅ JS salva em localStorage (chave: `usuario`)
6. ✅ Redireciona para homepage

#### LocalStorage:
```javascript
localStorage.setItem('usuario', JSON.stringify({
  id: 1,
  nome: "João",
  email: "joao@email.com",
  tipo: "maestro",
  token: "jwt_token"
}))

// Verificação:
const usuario = JSON.parse(localStorage.getItem('usuario'))
if (!usuario) { window.location = 'login.html' }
```

---

## 🔌 CAMADA DE API (js/api.js)

### Estrutura:
```javascript
CONFIG_API = {
  urlBase: 'http://localhost:3000/api',
  timeoutMs: 10000,
  modoDebug: true
}

// Função GET (para buscar dados)
obterDados(nomeEndpoint)
// Exemplo: obterDados('/academias')

// Função POST (para enviar dados)
enviarDados(nomeEndpoint, dadosEnvio)
// Exemplo: enviarDados('/mensagens/enviar', {nome: '...', email: '...'})

// Alertas visuais
exibirSucesso(mensagem)   // Verde
exibirErro(mensagem)      // Vermelho
```

### Headers Padrão:
```javascript
{
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}` // Se houver token
}
```

---

## 📊 ENDPOINTS ESPERADOS NO BACKEND

### 1. Academias
```
GET /api/academias
Response: [
  {
    id: 1,
    nome: "Academia São Paulo",
    descricao: "Descrição...",
    endereco: "Endereço...",
    telefone: "(11) 9999-9999"
  }
]
```

### 2. Mestres
```
GET /api/mestres
Response: [
  {
    id: 1,
    grau: "HACHIDAN",
    nome: "Nome Completo",
    posicao: "Cargo ou Função"
  }
]
```

### 3. Contato (Formulário)
```
POST /api/mensagens/enviar
Body: {
  nome: string,
  email: string,
  telefone: string,
  academia: string,
  mensagem: string
}
Response: { sucesso: boolean, mensagem: string }
```

### 4. Autenticação
```
POST /api/auth/login
Body: { usuario: string, senha: string }
Response: {
  sucesso: boolean,
  usuario: { id, nome, email, tipo },
  token?: string
}
```

### 5. Logout (futuro)
```
POST /api/auth/logout
Response: { sucesso: boolean }
```

---

## 🎨 SISTEMA DE CORES

### Variáveis CSS (defini em `:root`):
```css
--cor-preta: #050505
--cor-preta-suave: #1d1d1d
--cor-preta-card: #1f1f1f
--cor-branca: #ffffff
--cor-cinza-texto: #5e6470
--cor-cinza-borda: #e5e5e5
--cor-vermelha: #ff000f
--cor-vermelha-escura: #b30d17
--cor-vermelha-vinho: #320406
```

### Uso em Componentes:
- **Backgrounds escuros:** `--cor-preta-card`
- **Destaques:** `--cor-vermelha`
- **Botões primários:** `--cor-vermelha`
- **Botões secundários:** `--cor-branca` com borda

---

## 📱 RESPONSIVIDADE

### Breakpoints CSS:
```css
@media (max-width: 1120px) { ... }   /* Tablets grandes */
@media (max-width: 900px) { ... }    /* Tablets */
@media (max-width: 700px) { ... }    /* Mobile grande */
@media (max-width: 480px) { ... }    /* Mobile pequeno */
```

### Layout Responsivo:
- ✅ Container fluido: `min(1080px, 92vw)`
- ✅ Grids adaptáveis (2→1 col em mobile)
- ✅ Fonts escalonáveis com `clamp()`
- ✅ Imagens scaláveis

---

## 🔐 SEGURANÇA

### Recomendações:
1. **HTTPS obrigatório** em produção
2. **CORS configurado** para domínio específico
3. **Validações no backend** (não confiar só no frontend)
4. **Senhas** nunca armazenadas em localStorage (usar httpOnly cookies)
5. **Tokens JWT** com expiração de 24h
6. **Rate limiting** em endpoints críticos

### Validações Frontend (também fazer no backend):
- Email format
- Min/Max length
- Caracteres especiais
- Campos obrigatórios

---

## 🚀 COMO INTEGRAR COM O BACKEND

### Passo 1: Configurar URL da API
```javascript
// Em: js/api.js, linha 1
CONFIG_API.urlBase = 'https://seu-backend.com/api'
```

### Passo 2: Implementar Endpoints
Crie no seu backend os seguintes endpoints em JSON:
- `GET /api/academias`
- `GET /api/mestres`
- `POST /api/mensagens/enviar`
- `POST /api/auth/login`
- `POST /api/auth/logout` (futuro)

### Passo 3: Testar Cada Página
1. Homepage → Verificar carregamento de academias
2. Mestres → Verificar tabela com dados reais
3. Contato → Testar validação e envio
4. Login → Testar autenticação

### Passo 4: Configurar CORS no Backend
```
Access-Control-Allow-Origin: https://seu-frontend.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

---

## 📦 JAVASCRIPT - GUIA RÁPIDO

### index.js - Homepage
```javascript
function inicializarHome() {
  carregarAcademiasDinamicas()
  configurarEventosScroll()
}
```
**O que faz:** Carrega academias via API e aplica animações de scroll.

### mestres.js - Tabela Mestres
```javascript
function inicializarMestres() {
  carregarMestresDinamicos()
  configurarFiltroTabela()
  configurarOrdenacaoTabela()
}
```
**O que faz:** Carrega mestres, permite busca e ordenação.

### contato.js - Formulário
```javascript
function inicializarContato() {
  configurarFormularioContato()
  configurarValidacaoEmTempoReal()
}
```
**O que faz:** Valida campos e envia formulário.

### login.js - Autenticação
```javascript
function inicializarLogin() {
  verificarSeJaEstaAutenticado()
  configurarFormularioLogin()
}
```
**O que faz:** Autentica usuário e gerencia sessão.

---

## 🐛 DEBUGGING

### Console do Navegador (F12):
- `CONFIG_API.modoDebug = true` ativa logs detalhados
- Veja as requisições na aba "Network"
- Verifique `localStorage` na aba "Application"

### Checklist de Debug:
- [ ] URL da API está correta?
- [ ] CORS habilitado?
- [ ] Response JSON é válido?
- [ ] Validações de campo funcionam?
- [ ] Login persiste em localStorage?
- [ ] Redireciona após login?

---

## 📝 RESUMO DOS ARQUIVOS

| Arquivo | Tipo | Propósito |
|---------|------|----------|
| index.html | HTML | Homepage com academias dinâmicas |
| historia.html | HTML | Conteúdo histórico e cultural |
| sobre-o-rame.html | HTML | Informações institucionais |
| mestres.html | HTML | Tabela de mestres |
| fundamentos.html | HTML | Princípios de treinamento |
| contato.html | HTML | Formulário de contato |
| login.html | HTML | Página de autenticação |
| base.css | CSS | Estilos globais compartilhados |
| *.css | CSS | Estilos específicos de cada página |
| api.js | JS | Comunicação com backend |
| *.js | JS | Lógica de cada página |

---

## 📞 CONTATO TÉCNICO

Para dúvidas sobre integração, consulte:
- **Frontend Developer:** Gabriel Lindo
- **Documento gerado:** 10/05/2026
- **Versão Frontend:** 1.0 Otimizada

---

**Boa sorte na integração! 🚀**