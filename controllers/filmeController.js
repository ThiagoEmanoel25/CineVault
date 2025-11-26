const { connectToDatabase, getCollection } = require('../config/database');
const Filme = require('../models/Filme');

class FilmeController {

    // CREATE - Criar um novo filme
    static async criarFilme(filmeData) {
        try {
            console.log('Dados recebidos no controller:', filmeData);

            // Validar dados
            const validation = Filme.validate(filmeData);
            if (!validation.isValid) {
                console.error('Erros de validação:', validation.errors);
                throw new Error('Dados inválidos: ' + validation.errors.join(', '));
            }

            // Conectar ao banco
            await connectToDatabase();
            const collection = getCollection();

            // Criar filme - garantir que valores numéricos sejam números
            const filme = new Filme(
                filmeData.nome,
                filmeData.genero,
                filmeData.anolancemento,
                filmeData.diretor || '',
                filmeData.duracao ? (typeof filmeData.duracao === 'string' ? parseInt(filmeData.duracao) : filmeData.duracao) : 0,
                filmeData.avaliacao ? (typeof filmeData.avaliacao === 'string' ? parseFloat(filmeData.avaliacao) : filmeData.avaliacao) : 0,
                filmeData.sinopse || '',
                filmeData.poster || ''
            );

            console.log('Filme criado:', filme.toJSON());

            // Inserir no banco
            const result = await collection.insertOne(filme.toJSON());

            return {
                success: true,
                message: 'Filme criado com sucesso!',
                data: {
                    id: result.insertedId,
                    filme: filme.toJSON()
                }
            };

        } catch (error) {
            return {
                success: false,
                message: 'Erro ao criar filme: ' + error.message,
                data: null
            };
        }
    }

    // READ - Buscar todos os filmes
    static async buscarTodosFilmes() {
        try {
            await connectToDatabase();
            const collection = getCollection();

            const filmes = await collection.find({}).toArray();

            return {
                success: true,
                message: `${filmes.length} filme(s) encontrado(s)`,
                data: filmes
            };

        } catch (error) {
            return {
                success: false,
                message: 'Erro ao buscar filmes: ' + error.message,
                data: null
            };
        }
    }

    // READ - Buscar filme por ID
    static async buscarFilmePorId(id) {
        try {
            await connectToDatabase();
            const collection = getCollection();
            const { ObjectId } = require('mongodb');

            // Verificar se o ID é válido
            if (!ObjectId.isValid(id)) {
                throw new Error('ID inválido');
            }

            const filme = await collection.findOne({ _id: new ObjectId(id) });

            if (!filme) {
                return {
                    success: false,
                    message: 'Filme não encontrado',
                    data: null
                };
            }

            return {
                success: true,
                message: 'Filme encontrado',
                data: filme
            };

        } catch (error) {
            return {
                success: false,
                message: 'Erro ao buscar filme: ' + error.message,
                data: null
            };
        }
    }

    // READ - Buscar filmes por gênero
    static async buscarFilmesPorGenero(genero) {
        try {
            await connectToDatabase();
            const collection = getCollection();

            const filmes = await collection.find({ genero: { $regex: genero, $options: 'i' } }).toArray();

            return {
                success: true,
                message: `${filmes.length} filme(s) encontrado(s) no gênero "${genero}"`,
                data: filmes
            };

        } catch (error) {
            return {
                success: false,
                message: 'Erro ao buscar filmes por gênero: ' + error.message,
                data: null
            };
        }
    }

    // UPDATE - Atualizar filme
    static async atualizarFilme(id, filmeData) {
        try {
            // Validar dados
            const validation = Filme.validate(filmeData);
            if (!validation.isValid) {
                throw new Error('Dados inválidos: ' + validation.errors.join(', '));
            }

            await connectToDatabase();
            const collection = getCollection();
            const { ObjectId } = require('mongodb');

            // Verificar se o ID é válido
            if (!ObjectId.isValid(id)) {
                throw new Error('ID inválido');
            }

            // Verificar se o filme existe
            const filmeExistente = await collection.findOne({ _id: new ObjectId(id) });
            if (!filmeExistente) {
                return {
                    success: false,
                    message: 'Filme não encontrado',
                    data: null
                };
            }

            // Atualizar filme - garantir que valores numéricos sejam números
            const filme = new Filme(
                filmeData.nome,
                filmeData.genero,
                filmeData.anolancemento,
                filmeData.diretor || '',
                filmeData.duracao ? (typeof filmeData.duracao === 'string' ? parseInt(filmeData.duracao) : filmeData.duracao) : 0,
                filmeData.avaliacao ? (typeof filmeData.avaliacao === 'string' ? parseFloat(filmeData.avaliacao) : filmeData.avaliacao) : 0,
                filmeData.sinopse || '',
                filmeData.poster || ''
            );

            const dadosAtualizados = filme.toJSON();
            const result = await collection.updateOne(
                { _id: new ObjectId(id) },
                { $set: dadosAtualizados }
            );

            // Se não houve modificação, pode ser que os dados sejam idênticos
            // Mas ainda retornamos sucesso, pois o filme foi "atualizado" (mesmo que com os mesmos dados)
            if (result.matchedCount === 0) {
                return {
                    success: false,
                    message: 'Filme não encontrado',
                    data: null
                };
            }

            return {
                success: true,
                message: 'Filme atualizado com sucesso!',
                data: {
                    id: id,
                    filme: filme.toJSON()
                }
            };

        } catch (error) {
            return {
                success: false,
                message: 'Erro ao atualizar filme: ' + error.message,
                data: null
            };
        }
    }

    // DELETE - Deletar filme
    static async deletarFilme(id) {
        try {
            await connectToDatabase();
            const collection = getCollection();
            const { ObjectId } = require('mongodb');

            // Verificar se o ID é válido
            if (!ObjectId.isValid(id)) {
                throw new Error('ID inválido');
            }

            // Verificar se o filme existe
            const filmeExistente = await collection.findOne({ _id: new ObjectId(id) });
            if (!filmeExistente) {
                return {
                    success: false,
                    message: 'Filme não encontrado',
                    data: null
                };
            }

            // Deletar filme
            const result = await collection.deleteOne({ _id: new ObjectId(id) });

            if (result.deletedCount === 0) {
                throw new Error('Falha ao deletar filme');
            }

            return {
                success: true,
                message: 'Filme deletado com sucesso!',
                data: {
                    id: id,
                    filme: filmeExistente
                }
            };

        } catch (error) {
            return {
                success: false,
                message: 'Erro ao deletar filme: ' + error.message,
                data: null
            };
        }
    }

    // DELETE - Deletar todos os filmes
    static async deletarTodosFilmes() {
        try {
            await connectToDatabase();
            const collection = getCollection();

            const result = await collection.deleteMany({});

            return {
                success: true,
                message: `${result.deletedCount} filme(s) deletado(s) com sucesso!`,
                data: {
                    deletedCount: result.deletedCount
                }
            };

        } catch (error) {
            return {
                success: false,
                message: 'Erro ao deletar filmes: ' + error.message,
                data: null
            };
        }
    }
}

module.exports = FilmeController;

