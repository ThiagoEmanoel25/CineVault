require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { closeConnection } = require('./config/database');
const filmeRoutes = require('./routes/filmeRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const isDev = process.env.NODE_ENV === 'development';

// Configuração de segurança
app.use(helmet({
    contentSecurityPolicy: false, // Desabilitar para permitir inline scripts no frontend
    crossOriginEmbedderPolicy: false
}));

// Rate limiting - proteção contra abuso
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requisições por IP
    message: {
        success: false,
        message: 'Muitas requisições. Tente novamente em 15 minutos.',
        data: null
    }
});
app.use('/api', limiter);

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging em desenvolvimento
if (isDev) {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
        next();
    });
}

// Rotas da API
app.use('/api/filmes', filmeRoutes);

// Rota de health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'API está funcionando!',
        timestamp: new Date().toISOString(),
        version: '2.0.0'
    });
});

// Servir arquivos estáticos
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// Rota raiz - serve o index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// Tratamento de erros global
app.use((err, req, res, next) => {
    console.error('Erro:', err);
    res.status(500).json({
        success: false,
        message: isDev ? err.message : 'Erro interno do servidor',
        data: null
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Rota não encontrada',
        data: null
    });
});

// Iniciar servidor
const server = app.listen(PORT, () => {
    console.log('');
    console.log('🎬 ═══════════════════════════════════════════');
    console.log('   CATÁLOGO DE FILMES API v2.0.0');
    console.log('═══════════════════════════════════════════════');
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/api`);
    console.log(`🌐 Frontend: http://localhost:${PORT}`);
    console.log(`🔧 Ambiente: ${isDev ? 'Desenvolvimento' : 'Produção'}`);
    console.log('═══════════════════════════════════════════════');
    console.log('');
});

// Graceful shutdown
const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} recebido. Encerrando servidor...`);
    server.close(async () => {
        await closeConnection();
        console.log('Servidor encerrado com sucesso.');
        process.exit(0);
    });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = app;

