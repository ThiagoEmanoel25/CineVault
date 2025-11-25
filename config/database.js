const { MongoClient } = require('mongodb');

// Configurações do banco de dados
const config = {
    username: 'thiagoemanoel181_db_user',
    password: 'EMglaGBxGy5YSGoY',
    clusterurl: 'Cluster01',
    dbname: 'CatalogoTestee',
    collectionName: 'Filmes'
};

// URL de conexão
const url = `mongodb+srv://${config.username}:${config.password}@${config.clusterurl}.e4qtilx.mongodb.net/${config.dbname}?retryWrites=true&w=majority`;

let client;
let db;

// Função para conectar ao banco
async function connectToDatabase() {
    try {
        if (!client) {
            client = new MongoClient(url);
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
    config
};

