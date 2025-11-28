const express = require('express');
const router = express.Router();
const ComentarioController = require('../controllers/comentarioController');

// POST - Criar novo comentário
router.post('/', async (req, res) => {
    try {
        console.log('POST /api/comentarios - Body recebido:', req.body);
        const resultado = await ComentarioController.criarComentario(req.body);
        console.log('Resultado:', resultado);
        res.status(resultado.success ? 201 : 400).json(resultado);
    } catch (error) {
        console.error('Erro ao criar comentário:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor: ' + error.message,
            data: null
        });
    }
});

// GET - Buscar comentários de um filme
router.get('/filme/:filmeId', async (req, res) => {
    try {
        const { filmeId } = req.params;
        const resultado = await ComentarioController.buscarComentariosPorFilme(filmeId);
        res.status(resultado.success ? 200 : 404).json(resultado);
    } catch (error) {
        console.error('Erro ao buscar comentários:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            data: null
        });
    }
});

// GET - Buscar comentário por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await ComentarioController.buscarComentarioPorId(id);
        res.status(resultado.success ? 200 : 404).json(resultado);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            data: null
        });
    }
});

// GET - Estatísticas de comentários de um filme
router.get('/filme/:filmeId/stats', async (req, res) => {
    try {
        const { filmeId } = req.params;
        const resultado = await ComentarioController.obterEstatisticasFilme(filmeId);
        res.status(resultado.success ? 200 : 500).json(resultado);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            data: null
        });
    }
});

// PUT - Atualizar comentário
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await ComentarioController.atualizarComentario(id, req.body);
        res.status(resultado.success ? 200 : 404).json(resultado);
    } catch (error) {
        console.error('Erro ao atualizar comentário:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor: ' + error.message,
            data: null
        });
    }
});

// DELETE - Deletar comentário
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await ComentarioController.deletarComentario(id);
        res.status(resultado.success ? 200 : 404).json(resultado);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            data: null
        });
    }
});

// DELETE - Deletar todos os comentários de um filme
router.delete('/filme/:filmeId', async (req, res) => {
    try {
        const { filmeId } = req.params;
        const resultado = await ComentarioController.deletarComentariosDoFilme(filmeId);
        res.status(resultado.success ? 200 : 500).json(resultado);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            data: null
        });
    }
});

module.exports = router;
