# 🚀 Guia de Deploy - CineVault v2.0

Este guia vai te ensinar passo a passo como fazer o deploy da sua aplicação no Vercel.

## 📋 Pré-requisitos

1. Conta no GitHub (gratuita)
2. Conta no Vercel (gratuita) - [vercel.com](https://vercel.com)
3. Node.js 18+ instalado localmente
4. MongoDB Atlas configurado

## 🔧 Passo 1: Preparar o Projeto

### 1.1 Configurar Variáveis de Ambiente

**⚠️ IMPORTANTE:** O projeto agora usa variáveis de ambiente para segurança!

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Edite o arquivo `.env` com suas credenciais:
```env
MONGODB_URI=mongodb+srv://seu_usuario:sua_senha@cluster.mongodb.net/seu_banco?retryWrites=true&w=majority
MONGODB_DB_NAME=CatalogoTestee
MONGODB_COLLECTION=Filmes
PORT=3000
NODE_ENV=development
```

### 1.2 Instalar Dependências

```bash
npm install
```

### 1.3 Testar Localmente

```bash
npm run dev   # desenvolvimento com hot-reload
# ou
npm start     # produção
```

Acesse `http://localhost:3000` no navegador.

## 📦 Passo 2: Configurar Variáveis no Vercel

### 2.1 Variáveis Obrigatórias

No painel do Vercel (**Settings** → **Environment Variables**), adicione:

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `MONGODB_URI` | String de conexão do MongoDB | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `MONGODB_DB_NAME` | Nome do banco de dados | `CatalogoTestee` |
| `MONGODB_COLLECTION` | Nome da coleção | `Filmes` |
| `NODE_ENV` | Ambiente | `production` |

**⚠️ NUNCA commite o arquivo `.env` no Git!** (já está no `.gitignore`)

## 🌐 Passo 3: Fazer Deploy via GitHub

### 3.1 Criar Repositório no GitHub

1. Acesse [github.com](https://github.com) e faça login
2. Clique em **New Repository**
3. Dê um nome ao repositório (ex: `catalogo-filmes`)
4. **NÃO** marque "Initialize with README" (se você já tem arquivos)
5. Clique em **Create repository**

### 3.2 Conectar Repositório Local ao GitHub

No terminal, execute:

```bash
# Se ainda não inicializou o git
git init

# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "Initial commit - Catálogo de Filmes"

# Adicionar o repositório remoto (substitua SEU_USUARIO e SEU_REPOSITORIO)
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git

# Enviar para o GitHub
git branch -M main
git push -u origin main
```

### 3.3 Fazer Deploy no Vercel

#### Opção A: Via Interface Web (Recomendado para Iniciantes)

1. Acesse [vercel.com](https://vercel.com) e faça login (pode usar sua conta GitHub)
2. Clique em **Add New Project**
3. Selecione seu repositório do GitHub
4. O Vercel detectará automaticamente as configurações:
   - **Framework Preset:** Other
   - **Root Directory:** `./`
   - **Build Command:** (deixe vazio ou `npm install`)
   - **Output Directory:** (deixe vazio)
   - **Install Command:** `npm install`
5. Clique em **Deploy**
6. Aguarde o deploy (geralmente 1-2 minutos)
7. Pronto! Sua aplicação estará online! 🎉

#### Opção B: Via Vercel CLI

1. Instale o Vercel CLI:
```bash
npm install -g vercel
```

2. No diretório do projeto, execute:
```bash
vercel
```

3. Siga as instruções:
   - Faça login na sua conta Vercel
   - Confirme as configurações
   - Aguarde o deploy

4. Para fazer deploy em produção:
```bash
vercel --prod
```

## 🔄 Passo 4: Atualizações Futuras

Toda vez que você fizer push para o GitHub, o Vercel automaticamente fará um novo deploy!

```bash
git add .
git commit -m "Descrição das mudanças"
git push
```

## 🌍 Passo 5: Acessar sua Aplicação

Após o deploy, você receberá uma URL como:
- `https://seu-projeto.vercel.app`

Esta URL estará disponível publicamente na internet!

## 📝 Configurações Importantes

### Porta do Servidor

O Vercel automaticamente define a porta através da variável `PORT`. O código já está configurado para usar `process.env.PORT || 3000`.

### Arquivos Estáticos

Os arquivos na pasta `public/` são servidos automaticamente pelo Vercel graças ao `express.static('public')` no `server.js`.

### API Routes

Todas as rotas que começam com `/api/` são direcionadas para o `server.js` (configurado no `vercel.json`).

## 🐛 Troubleshooting (Solução de Problemas)

### Erro: "Module not found"
- Certifique-se de que todas as dependências estão no `package.json`
- Execute `npm install` localmente para verificar

### Erro: "Cannot connect to MongoDB"
- Verifique se as credenciais do MongoDB estão corretas
- Certifique-se de que o IP do Vercel está permitido no MongoDB Atlas (ou permita todos os IPs: 0.0.0.0/0)

### Erro: "Build failed"
- Verifique os logs no painel do Vercel
- Teste localmente primeiro com `npm start`

## 🎯 Dicas Finais

1. **Sempre teste localmente antes de fazer deploy**
2. **Use variáveis de ambiente para informações sensíveis** (credenciais, chaves de API)
3. **Monitore os logs no painel do Vercel** para identificar problemas
4. **O Vercel oferece deploy automático** sempre que você faz push no GitHub

## 🆕 Novidades da v2.0

- **Segurança melhorada:** Credenciais via variáveis de ambiente
- **Rate limiting:** Proteção contra abuso da API
- **Helmet.js:** Headers de segurança HTTP
- **Frontend moderno:** Design dark mode com animações
- **Paginação:** API suporta `?page=1&limit=10`
- **Busca avançada:** `?busca=termo` pesquisa em nome, diretor e sinopse

## 📚 Recursos Úteis

- [Documentação do Vercel](https://vercel.com/docs)
- [Vercel CLI](https://vercel.com/docs/cli)
- [Guia de Node.js no Vercel](https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/node-js)
- [MongoDB Atlas](https://www.mongodb.com/atlas)

---

**Pronto!** Agora você tem o CineVault v2.0 rodando na nuvem! 🎬🚀


