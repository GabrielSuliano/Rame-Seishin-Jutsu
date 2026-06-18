# 📋 Rame Seishin Jutsu - Guia de Integração com Backend

## Visão Geral

Este documento descreve onde e como integrar as chamadas de API com seu backend no front-end. O site é dividido em 6 páginas principais, cada uma com funcionalidades específicas.

---

## 🏗️ Estrutura de Pastas

```
site-organizado/
├── paginas/              # Todas as páginas HTML
│   ├── index.html        # Home - Homepage principal
│   ├── historia.html     # História - Informações históricas
│   ├── sobre-o-rame.html # Sobre - Filosofia e academ
├── css/                  # Estilos organizados por página
│   ├── base.css          # Estilos globais compartilhados
│   ├── index.css         # Estilos da home
│   ├── historia.css      # Estilos da página de história
│   └── [outros...]       # CSS específico de cada página
├── js/                   # JavaScript (novo - para integração)
│   ├── api.js            # Funções de chamadas com API
│   ├── utilitarios.js    # Funções auxiliares
│   └── validacoes.js     # Validações de formulário
└── imagens/              # Imagens do site
```

---

## 📡 Endpoints Necessários

### 1. **PÁGINA: HOME (index.html)**

#### Endpoint: `GET /api/conteudo/home`
**Função:** Obter dados dinâmicos da página inicial  
**Quando usar:** Ao carregar a página  
**Integração:** No arquivo `js/api.js`

```javascript
// Estrutura esperada da resposta:
{
  "titulo": "Rame Seishin Jutsu",
  "subtitulo": "Arte Marcial Tradicional",
  "hero": {
    "etiqueta": "Arte Marcial Tradicional Japonesa",
    "titulo": "Rame Seishin Jutsu",
    "descricao": "A harmonia entre corpo, mente e espírito...",
    "botaoPrimario": "Começar Treino",
    "botaoSecundario": "Conheça Nossa Arte"
  },
  "filosofia": [
    {
      "icone": "◎",
      "titulo": "A Arte Marcial",
      "descricao": "Arte marcial autêntica...",
      "classe": "escuro"
    }
  ],
  "pilares": [
    {
      "numero": "1",
      "titulo": "Corpo",
      "descricao": "Desenvolvimento físico..."
    }
  ]
}
```

**Arquivo para adicionar a chamada:**  
→ `paginas/index.html` - Próximo à linha 45 (após comentário "<!-- Hero principal -->")

---

### 2. **PÁGINA: HISTÓRIA (historia.html)**

#### Endpoint: `GET /api/conteudo/historia`
**Função:** Obter textos e informações históricas  
**Quando usar:** Ao carregar a página

```javascript
{
  "daiNippon": {
    "titulo": "Dai Nippon Butoku Kai",
    "descricao": "A Dai Nippon Butoku Kai foi fundada em 1895...",
    "paragrafos": ["parágrafo 1", "parágrafo 2"]
  },
  "butokuden": {
    "titulo": "Butokuden",
    "kanji": "武徳殿",
    "descricao": "O Butokuden é o dojo histórico..."
  },
  "bushido": [
    {
      "titulo": "Bushido",
      "valor": "Lealdade",
      "caractere": "字"
    }
  ]
}
```

**Arquivo para adicionar a chamada:**  
→ `paginas/historia.html` - Próximo à linha 30 (após o hero interno)

---

### 3. **PÁGINA: SOBRE O RAME (sobre-o-rame.html)**

#### Endpoint: `GET /api/academias`
**Função:** Listar todas as academias parceiras  
**Quando usar:** Ao carregar a página na seção "Conheça Nossas Academias"

```javascript
{
  "academias": [
    {
      "id": 1,
      "nome": "Rame Seishin Jutsu Barão",
      "descricao": "Nossa academia principal...",
      "localizacao": "São Paulo - SP",
      "telefone": "(11) 99999-9999"
    },
    {
      "id": 2,
      "nome": "Rame Seisho Budha",
      "descricao": "Tradição e excelência..."
    }
  ]
}
```

**Arquivo para adicionar a chamada:**  
→ `paginas/sobre-o-rame.html` - Próximo à linha 95 (dentro da seção "Conheça Nossas Academias")

---

### 4. **PÁGINA: MESTRES (mestres.html)**

#### Endpoint: `GET /api/mestres`
**Função:** Obter informações de mestres  
**Quando usar:** Ao carregar a página

```javascript
{
  "mestres": [
    {
      "id": 1,
      "nome": "Francisco Soares dos Anjos Filho",
      "titulo": "Sensei",
      "descricao": "Sensei Francisco representa a nova geração...",
      "especialidades": ["Técnicas de solo", "Finalizações", "Filosofia marcial"],
      "fotografia": "/imagens/sensei-francisco.jpg",
      "kanji": "道",
      "kanjiLegenda": "Caminho"
    }
  ]
}
```

**Arquivo para adicionar a chamada:**  
→ `paginas/mestres.html` - Próximo à linha 20 (dentro da section com classe "grade-mestre")

---

### 5. **PÁGINA: FUNDAMENTOS (fundamentos.html)**

#### Endpoint: `GET /api/fundamentos`
**Função:** Obter conteúdo de fundamentos e áreas de treinamento  
**Quando usar:** Ao carregar a página

```javascript
{
  "principios": [
    {
      "icone": "◎",
      "titulo": "Técnica e Precisão",
      "descricao": "Cada movimento é executado com atenção...",
      "classe": "escuro"
    }
  ],
  "areasTreinamento": [
    {
      "nome": "Posições Fundamentais",
      "descricao": "Aprenda as posições..."
    }
  ],
  "caminhoTreinamento": [
    {
      "numero": "1",
      "nivel": "Iniciante",
      "descricao": "Primeiros passos no caminho..."
    }
  ]
}
```

**Arquivo para adicionar a chamada:**  
→ `paginas/fundamentos.html` - Próximo à linha 35 (dentro de "Princípios Fundamentais")

---

### 6. **PÁGINA: CONTATO (contato.html)** ⭐ IMPORTANTE

#### Endpoint: `POST /api/mensagens/enviar`
**Função:** Enviar formulário de contato  
**Método:** POST  
**Quando usar:** Ao clicar no botão "Enviar Mensagem"

```javascript
// DADOS ENVIADOS:
{
  "nomeCompleto": "string (obrigatório)",
  "email": "string (obrigatório, válido)",
  "telefone": "string (obrigatório)",
  "academia": "string (obrigatório)",
  "mensagem": "string (obrigatório)",
  "dataEnvio": "ISO 8601 datetime (automático)",
  "tipoContato": "professores" // sempre esse valor
}

// RESPOSTA ESPERADA:
{
  "sucesso": true,
  "mensagem": "Mensagem enviada com sucesso!",
  "idMensagem": 12345,
  "dataProcessamento": "2026-05-10T14:30:00Z"
}
```

**Arquivo para adicionar a chamada:**  
→ `paginas/contato.html` - Próximo à linha 45 (no `<form>`)

**⚠️ Validações obrigatórias antes de enviar:**
- Nome: mínimo 3 caracteres, máximo 100
- Email: formato válido (usar regex)
- Telefone: com ou sem máscara
- Academia: mínimo 3 caracteres
- Mensagem: mínimo 10 caracteres, máximo 5000

---

## 🛠️ Arquivo de Configuração de API

Você deve criar um arquivo `js/api.js` com a configuração base:

```javascript
/**
 * Configuração de API para integração com backend
 * Define URL base e funções auxiliares para requisições
 */

// URL base do backend - AJUSTE CONFORME SEU AMBIENTE
const URL_BASE_API = 'http://localhost:3000/api';
// Em produção: const URL_BASE_API = 'https://seu-dominio.com/api';

/**
 * Função auxiliar para fazer requisições GET
 * @param {string} endpoint - Caminho do endpoint
 * @param {object} opcoes - Opções adicionais da requisição
 * @returns {Promise} Resposta da API
 */
async function obterDadosAPI(endpoint, opcoes = {}) {
  try {
    const resposta = await fetch(`${URL_BASE_API}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      ...opcoes
    });

    if (!resposta.ok) {
      throw new Error(`Erro ${resposta.status}: ${resposta.statusText}`);
    }

    return await resposta.json();
  } catch (erro) {
    console.error('Erro ao obter dados da API:', erro);
    throw erro;
  }
}

/**
 * Função auxiliar para fazer requisições POST
 * @param {string} endpoint - Caminho do endpoint
 * @param {object} dados - Dados a enviar
 * @returns {Promise} Resposta da API
 */
async function enviarDadosAPI(endpoint, dados) {
  try {
    const resposta = await fetch(`${URL_BASE_API}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dados)
    });

    if (!resposta.ok) {
      throw new Error(`Erro ${resposta.status}: ${resposta.statusText}`);
    }

    return await resposta.json();
  } catch (erro) {
    console.error('Erro ao enviar dados para API:', erro);
    throw erro;
  }
}
```

---

## 📝 Checklist de Implementação

Para cada página, siga este checklist:

- [ ] Adicionar arquivo `<script>` na página HTML: `<script src="../js/api.js"></script>`
- [ ] Criar função específica para carregar dados da página
- [ ] Chamar a função ao evento `DOMContentLoaded`
- [ ] Adicionar tratamento de erros (exibir mensagem amigável ao usuário)
- [ ] Testar a integração no navegador (F12 → Console)
- [ ] Validar dados antes de enviar (especialmente em formulários)

---

## 🔒 Segurança

### Token de Autenticação (se necessário)
Se seu backend exigir token JWT:

```javascript
// Adicionar no arquivo api.js
const obterToken = () => localStorage.getItem('tokenAutenticacao');

// Incluir no header das requisições autenticadas:
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${obterToken()}`
}
```

### CORS (Cross-Origin Resource Sharing)
Certifique-se de que seu backend permite requisições do domínio frontend.

---

## 📊 Exemplos de Uso

### Exemplo 1: Carregar dados na Home

```javascript
// Em: paginas/index.html
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Obter dados da API
    const dadosHome = await obterDadosAPI('/conteudo/home');
    
    // Atualizar título
    document.querySelector('.hero h1').textContent = dadosHome.hero.titulo;
    
    // Atualizar filosofia (exemplo - iterar sobre array)
    const containerFilosofia = document.querySelector('.grade-cartoes-2');
    containerFilosofia.innerHTML = dadosHome.filosofia
      .map(item => `
        <article class="cartao-filosofia ${item.classe}">
          <span class="icone-quadrado">${item.icone}</span>
          <h3>${item.titulo}</h3>
          <p>${item.descricao}</p>
        </article>
      `)
      .join('');
  } catch (erro) {
    console.error('Erro ao carregar home:', erro);
    // Exibir mensagem amigável ao usuário
  }
});
```

### Exemplo 2: Enviar Formulário de Contato

```javascript
// Em: paginas/contato.html
const formularioContato = document.querySelector('form');

formularioContato.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  
  // Coletar dados do formulário
  const dadosFormulario = {
    nomeCompleto: document.getElementById('nome').value,
    email: document.getElementById('email').value,
    telefone: document.getElementById('telefone').value,
    academia: document.getElementById('academia').value,
    mensagem: document.getElementById('mensagem').value
  };
  
  try {
    // Validar dados
    validarFormularioContato(dadosFormulario);
    
    // Enviar para API
    const resposta = await enviarDadosAPI('/mensagens/enviar', dadosFormulario);
    
    // Exibir sucesso
    alert('Mensagem enviada com sucesso!');
    formularioContato.reset();
  } catch (erro) {
    // Exibir erro
    alert('Erro ao enviar mensagem: ' + erro.message);
  }
});
```

---

## 🚀 Próximos Passos

1. Reconfirmar URL base da API com seu time backend
2. Obter documentação completa dos endpoints (respostas, códigos de erro)
3. Implementar autenticação (se aplicável)
4. Testar todas as integrações em ambiente local
5. Implementar sistema de cache (se necessário para performance)

---

**Data de Criação:** 10 de maio de 2026  
**Versão:** 1.0  
**Responsável:** Otimização e Integração Frontend
