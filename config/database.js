const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

// Configurações do banco de dados via variáveis de ambiente
const config = {
    uri: process.env.MONGODB_URI,
    dbname: process.env.MONGODB_DB_NAME || 'CatalogoTestee',
    collectionName: process.env.MONGODB_COLLECTION || 'Filmes'
};

// Validar se a URI está configurada
if (!config.uri) {
    console.error('❌ MONGODB_URI não configurada! Configure nas variáveis de ambiente do Vercel.');

}

let client;
let db;

// Função para conectar ao banco
async function connectToDatabase() {
    try {
        if (!config.uri) {
            throw new Error('MONGODB_URI não configurada! Configure nas variáveis de ambiente do Vercel.');
        }

        if (!client) {
            client = new MongoClient(config.uri);
            await client.connect();
            console.log('Conectado ao MongoDB Atlas!');
        }

        if (!db) {
            db = client.db(config.dbname);
        }

        return { client, db };
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
        throw error;
    }
}

// Função para obter a coleção
function getCollection() {
    if (!db) {
        throw new Error('Banco de dados não conectado. Chame connectToDatabase() primeiro.');
    }
    return db.collection(config.collectionName);
}

// Função para fechar a conexão
async function closeConnection() {
    if (client) {
        await client.close();
        client = null;
        db = null;
        console.log('Conexão fechada.');
    }
}

module.exports = {
    connectToDatabase,
    getCollection,
    closeConnection,
    config,
    ObjectId
};

console.log("🔍 MONGODB_URI carregada:", process.env.MONGODB_URI);