const express = require('express');
const cors = require('cors');
const FilmeController = require('./controllers/filmeController');
const { closeConnection } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas da API (ANTES dos arquivos estáticos)

// GET - Listar todos os filmes
app.get('/api/filmes', async (req, res) => {
    try {
        const resultado = await FilmeController.buscarTodosFilmes();
        res.status(resultado.success ? 200 : 500).json(resultado);
    } catch (error) {
        console.error('Erro ao buscar filmes:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor: ' + error.message,
            data: null
        });
    }
});

// GET - Buscar filme por ID
app.get('/api/filmes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await FilmeController.buscarFilmePorId(id);
        res.status(resultado.success ? 200 : 404).json(resultado);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            data: null
        });
    }
});

// GET - Buscar filmes por gênero
app.get('/api/filmes/genero/:genero', async (req, res) => {
    try {
        const { genero } = req.params;
        const resultado = await FilmeController.buscarFilmesPorGenero(genero);
        res.status(resultado.success ? 200 : 500).json(resultado);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            data: null
        });
    }
});

// POST - Criar novo filme
app.post('/api/filmes', async (req, res) => {
    try {
        console.log('POST /api/filmes - Body recebido:', req.body);
        const resultado = await FilmeController.criarFilme(req.body);
        console.log('Resultado:', resultado);
        res.status(resultado.success ? 201 : 400).json(resultado);
    } catch (error) {
        console.error('Erro ao criar filme:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor: ' + error.message,
            data: null
        });
    }
});

// PUT - Atualizar filme
app.put('/api/filmes/:id', async (req, res) => {
    try {
        console.log('PUT /api/filmes/:id - ID:', req.params.id, 'Body:', req.body);
        const { id } = req.params;
        const resultado = await FilmeController.atualizarFilme(id, req.body);
        console.log('Resultado da atualização:', resultado);
        // Retornar 200 mesmo se não encontrado, mas com success: false
        res.status(resultado.success ? 200 : 200).json(resultado);
    } catch (error) {
        console.error('Erro ao atualizar filme:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor: ' + error.message,
            data: null
        });
    }
});

// DELETE - Deletar filme
app.delete('/api/filmes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await FilmeController.deletarFilme(id);
        res.status(resultado.success ? 200 : 404).json(resultado);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            data: null
        });
    }
});

// Rota de teste
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'API está funcionando!' });
});

// Servir arquivos estáticos (DEPOIS das rotas da API)
const publicPath = path.join(__dirname, 'public');
console.log('📁 Caminho dos arquivos estáticos:', publicPath);
app.use(express.static(publicPath));

// Rota raiz - serve o index.html
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    console.log('📄 Servindo index.html de:', indexPath);
    res.sendFile(indexPath);
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📡 API disponível em http://localhost:${PORT}/api`);
    console.log(`🌐 Frontend disponível em http://localhost:${PORT}`);
    console.log(`📁 Diretório atual: ${__dirname}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('Encerrando servidor...');
    await closeConnection();
    process.exit(0);
});

module.exports = app;

