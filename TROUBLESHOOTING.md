# 🔧 Guia de Solução de Problemas

## ❌ Problema: Página não carrega no localhost

### Passo 1: Verificar se o servidor está rodando

1. Abra o terminal na pasta do projeto
2. Execute:
```bash
npm start
```

3. Você deve ver a mensagem:
```
🚀 Servidor rodando na porta 3000
📡 API disponível em http://localhost:3000/api
```

### Passo 2: Verificar se a porta está livre

Se você ver um erro como "EADDRINUSE" ou "port already in use":

**Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -ti:3000 | xargs kill -9
```

Ou simplesmente mude a porta no `server.js`:
```javascript
const PORT = process.env.PORT || 3001; // Mude para 3001 ou outra porta
```

### Passo 3: Verificar se os arquivos existem

Certifique-se de que a pasta `public` contém:
- ✅ `index.html`
- ✅ `styles.css`
- ✅ `app.js`

### Passo 4: Testar a API diretamente

Abra no navegador:
- `http://localhost:3000/api/health` - Deve retornar JSON
- `http://localhost:3000/api/filmes` - Deve retornar lista de filmes

### Passo 5: Verificar o console do navegador

1. Abra o DevTools (F12)
2. Vá na aba "Console"
3. Veja se há erros em vermelho
4. Vá na aba "Network"
5. Recarregue a página (F5)
6. Veja se há requisições falhando (em vermelho)

### Passo 6: Verificar o console do servidor

No terminal onde o servidor está rodando, veja se há mensagens de erro.

## 🔍 Problemas Comuns

### Erro: "Cannot GET /"
- **Causa**: Servidor não está rodando ou rota não configurada
- **Solução**: Verifique se executou `npm start`

### Erro: "Failed to load resource: 404"
- **Causa**: Arquivo não encontrado ou caminho incorreto
- **Solução**: Verifique se os arquivos estão na pasta `public/`

### Erro: "Connection refused"
- **Causa**: Servidor não está rodando
- **Solução**: Execute `npm start`

### Erro: "MongoDB connection failed"
- **Causa**: Problema de conexão com o banco
- **Solução**: Verifique as credenciais no `config/database.js`

### Página em branco
- **Causa**: Erro no JavaScript
- **Solução**: Abra o Console (F12) e veja os erros

## ✅ Checklist Rápido

- [ ] Node.js instalado? (`node --version`)
- [ ] Dependências instaladas? (`npm install`)
- [ ] Servidor rodando? (`npm start`)
- [ ] Porta 3000 livre?
- [ ] Arquivos na pasta `public/`?
- [ ] Navegador acessando `http://localhost:3000`?

## 🆘 Ainda não funciona?

1. Pare o servidor (Ctrl + C)
2. Delete `node_modules` e `package-lock.json`
3. Execute `npm install` novamente
4. Execute `npm start`
5. Tente acessar `http://localhost:3000`

Se ainda não funcionar, compartilhe:
- Mensagens de erro do console do servidor
- Mensagens de erro do console do navegador (F12)
- Screenshot da página (se possível)

