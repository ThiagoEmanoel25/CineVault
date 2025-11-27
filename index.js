const {MongoClient} = require('mongodb');

const username = 'thiagoemanoel181_db_user';
const password = 'EMglaGBxGy5YSGoY';
const clusterurl = 'cluster01';
const dbname = 'CatalogoTestee';
const collectionName = 'Filmes';

const url = `mongodb+srv://${username}:${password}@${clusterurl}.e4qtilx.mongodb.net/${dbname}?retryWrites=true&w=majority`;
//mongodb+srv://thiagoemanoel181_db_user:<db_password>@cluster01.e4qtilx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster01
const client = new MongoClient(url);

async function main() {
    try {
        await client.connect();
        console.log('Conectado ao MongoDB atlas!');
        const db = client.db(dbname);
        const collection = db.collection(collectionName);


        const Filmes = { nome: "the batman", genero: "ação", anolancemento: 2022};
        const result = await collection.insertOne(Filmes);
        console.log('filme inserido com sucesso com o id:', result.insertedId);

    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}
main().catch(console.error);

