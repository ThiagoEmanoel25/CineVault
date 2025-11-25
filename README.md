# CRUD de Filmes - MongoDB Atlas

Este projeto implementa um sistema CRUD (Create, Read, Update, Delete) completo para gerenciar filmes usando MongoDB Atlas e Node.js.

## 📁 Estrutura do Projeto

```
meu-primeiro-projeto-em-node/
├── config/
│   └── database.js          # Configuração do banco de dados
├── controllers/
│   └── filmeController.js   # Lógica de negócio e operações CRUD
├── models/
│   └── Filme.js            # Modelo de dados do filme
├── routes/                  # (Para futuras implementações)
├── index.js                 # Arquivo original
├── crud-demo.js            # Demonstração completa do CRUD
├── interface.js            # Interface interativa
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

### 2. Executar a Interface Interativa
```bash
npm start
```
ou
```bash
node interface.js
```

### 3. Executar Demonstração Automática
```bash
npm run demo
```
ou
```bash
node crud-demo.js
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

## 🎯 Próximos Passos

- [ ] Implementar API REST com Express.js
- [ ] Adicionar autenticação e autorização
- [ ] Implementar paginação para listagens
- [ ] Adicionar upload de imagens para filmes
- [ ] Implementar sistema de avaliações
- [ ] Adicionar testes unitários

## 📄 Licença

ISC License

