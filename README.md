# 🎬 Catálogo de Filmes - Full Stack

Este projeto implementa um sistema CRUD (Create, Read, Update, Delete) completo para gerenciar filmes usando MongoDB Atlas, Node.js, Express e um frontend moderno com HTML/CSS/JavaScript.

## ✨ Características

- 🎨 **Frontend Moderno**: Interface responsiva e estilosa com design dark mode
- 🚀 **API REST**: Backend completo com Express.js
- 💾 **MongoDB Atlas**: Banco de dados na nuvem
- 🌐 **Deploy Pronto**: Configurado para deploy no Vercel
- 📱 **Responsivo**: Funciona perfeitamente em desktop e mobile

## 📁 Estrutura do Projeto

```
meu-primeiro-projeto-em-node/
├── config/
│   └── database.js          # Configuração do banco de dados
├── controllers/
│   └── filmeController.js   # Lógica de negócio e operações CRUD
├── models/
│   └── Filme.js            # Modelo de dados do filme
├── public/                  # Frontend
│   ├── index.html          # Página principal
│   ├── styles.css          # Estilos modernos
│   └── app.js              # Lógica do frontend
├── routes/                  # (Para futuras implementações)
├── server.js               # Servidor Express (API REST)
├── index.js                # Arquivo original
├── crud-demo.js            # Demonstração completa do CRUD
├── interface.js            # Interface interativa CLI
├── vercel.json             # Configuração do Vercel
├── package.json
└── README.md
```

## 🎬 Modelo de Dados

Cada filme possui os seguintes campos:
- **nome**: Nome do filme (string, obrigatório)
- **genero**: Gênero do filme (string, obrigatório)
- **anolancemento**: Ano de lançamento (number, obrigatório, entre 1800 e 2030)

## 🚀 Como Usar

### 1. Instalar Dependências
```bash
npm install
```

### 2. Executar o Servidor (API + Frontend)
```bash
npm start
```
Isso iniciará o servidor Express na porta 3000. Acesse `http://localhost:3000` no navegador para ver o frontend.

### 3. Outros Comandos Disponíveis

**Interface CLI Interativa:**
```bash
npm run interface
```

**Demonstração Automática:**
```bash
npm run demo
```

## 🌐 API REST Endpoints

A API está disponível em `/api`:

- `GET /api/filmes` - Listar todos os filmes
- `GET /api/filmes/:id` - Buscar filme por ID
- `GET /api/filmes/genero/:genero` - Buscar filmes por gênero
- `POST /api/filmes` - Criar novo filme
- `PUT /api/filmes/:id` - Atualizar filme
- `DELETE /api/filmes/:id` - Deletar filme
- `GET /api/health` - Verificar status da API

### Exemplo de Uso da API

```bash
# Criar filme
curl -X POST http://localhost:3000/api/filmes \
  -H "Content-Type: application/json" \
  -d '{"nome":"The Batman","genero":"Ação","anolancemento":2022}'

# Listar filmes
curl http://localhost:3000/api/filmes
```

## 📋 Operações CRUD Disponíveis

### CREATE (Criar)
- Criar um novo filme com validação de dados
- Valida se todos os campos obrigatórios estão preenchidos
- Valida se o ano está em um range válido

### READ (Ler)
- **Listar todos os filmes**: Retorna todos os filmes do banco
- **Buscar por ID**: Busca um filme específico pelo ID
- **Buscar por gênero**: Busca filmes por gênero (busca parcial, case-insensitive)

### UPDATE (Atualizar)
- Atualiza um filme existente pelo ID
- Valida os novos dados antes de atualizar
- Verifica se o filme existe antes de atualizar

### DELETE (Deletar)
- **Deletar filme específico**: Remove um filme pelo ID
- **Deletar todos os filmes**: Remove todos os filmes (com confirmação)

## 🛠️ Funcionalidades

### Validação de Dados
- Validação automática de todos os campos
- Mensagens de erro descritivas
- Verificação de tipos de dados

### Tratamento de Erros
- Tratamento robusto de erros
- Mensagens de sucesso e erro claras
- Conexão segura com o banco de dados

### Interface Amigável
- Menu interativo fácil de usar
- Confirmações para operações destrutivas
- Feedback visual com emojis

## 🔧 Configuração do Banco

O sistema está configurado para usar MongoDB Atlas com as seguintes credenciais:
- **Database**: CatalogoTestee
- **Collection**: Filmes
- **Cluster**: Cluster01

## 📝 Exemplos de Uso

### Criar um Filme
```javascript
const resultado = await FilmeController.criarFilme({
    nome: "The Batman",
    genero: "ação",
    anolancemento: 2022
});
```

### Buscar Todos os Filmes
```javascript
const resultado = await FilmeController.buscarTodosFilmes();
```

### Buscar por Gênero
```javascript
const resultado = await FilmeController.buscarFilmesPorGenero("ação");
```

### Atualizar Filme
```javascript
const resultado = await FilmeController.atualizarFilme(id, {
    nome: "The Batman - Edição Especial",
    genero: "ação",
    anolancemento: 2023
});
```

### Deletar Filme
```javascript
const resultado = await FilmeController.deletarFilme(id);
```

## 🚀 Deploy no Vercel

Este projeto está configurado para deploy no Vercel! Veja o guia completo em [DEPLOY.md](./DEPLOY.md).

**Resumo rápido:**
1. Faça push do código para o GitHub
2. Conecte o repositório no Vercel
3. Deploy automático! 🎉

Para mais detalhes, consulte o arquivo `DEPLOY.md`.

## 🎯 Funcionalidades do Frontend

- ✅ Interface moderna e responsiva
- ✅ Adicionar, editar e deletar filmes
- ✅ Busca em tempo real
- ✅ Filtros por gênero
- ✅ Notificações toast
- ✅ Modal de confirmação
- ✅ Design dark mode elegante
- ✅ Animações suaves

## 🎯 Próximos Passos

- [x] Implementar API REST com Express.js
- [x] Criar frontend moderno
- [x] Configurar deploy no Vercel
- [ ] Adicionar autenticação e autorização
- [ ] Implementar paginação para listagens
- [ ] Adicionar upload de imagens para filmes
- [ ] Implementar sistema de avaliações
- [ ] Adicionar testes unitários

## 📄 Licença

ISC License

