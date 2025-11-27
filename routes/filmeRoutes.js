const express = require('express');
const router = express.Router();
const FilmeController = require('../controllers/filmeController');

// GET - Listar todos os filmes (com paginação e busca)
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, busca, genero } = req.query;
        const resultado = await FilmeController.buscarTodosFilmes({
            page: parseInt(page),
            limit: parseInt(limit),
            busca,
            genero
        });
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
router.get('/:id', async (req, res) => {
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
router.get('/genero/:genero', async (req, res) => {
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
router.post('/', async (req, res) => {
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
router.put('/:id', async (req, res) => {
    try {
        console.log('PUT /api/filmes/:id - ID:', req.params.id, 'Body:', req.body);
        const { id } = req.params;
        const resultado = await FilmeController.atualizarFilme(id, req.body);
        console.log('Resultado da atualização:', resultado);
        res.status(resultado.success ? 200 : 404).json(resultado);
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
router.delete('/:id', async (req, res) => {
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

module.exports = router;
