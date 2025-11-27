const { connectToDatabase, getCollection, ObjectId } = require('../config/database');
const Filme = require('../models/Filme');

class FilmeController {

    // Helper para converter dados do filme
    static #parseFilmeData(filmeData) {
        return new Filme(
            filmeData.nome,
            filmeData.genero,
            filmeData.anolancemento,
            filmeData.diretor || '',
            filmeData.duracao ? (typeof filmeData.duracao === 'string' ? parseInt(filmeData.duracao) : filmeData.duracao) : 0,
            filmeData.avaliacao ? (typeof filmeData.avaliacao === 'string' ? parseFloat(filmeData.avaliacao) : filmeData.avaliacao) : 0,
            filmeData.sinopse || '',
            filmeData.poster || ''
        );
    }

    // CREATE - Criar um novo filme
    static async criarFilme(filmeData) {
        try {
            // Validar dados
            const validation = Filme.validate(filmeData);
            if (!validation.isValid) {
                return {
                    success: false,
                    message: 'Dados inválidos: ' + validation.errors.join(', '),
                    data: null
                };
            }

            await connectToDatabase();
            const collection = getCollection();

            const filme = this.#parseFilmeData(filmeData);
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
            console.error('Erro ao criar filme:', error);
            return {
                success: false,
                message: 'Erro ao criar filme: ' + error.message,
                data: null
            };
        }
    }

    // READ - Buscar todos os filmes (com paginação e busca)
    static async buscarTodosFilmes(options = {}) {
        try {
            const { page = 1, limit = 50, busca, genero } = options;
            const skip = (page - 1) * limit;

            await connectToDatabase();
            const collection = getCollection();

            // Construir filtro de busca
            const filtro = {};
            
            if (busca) {
                filtro.$or = [
                    { nome: { $regex: busca, $options: 'i' } },
                    { diretor: { $regex: busca, $options: 'i' } },
                    { sinopse: { $regex: busca, $options: 'i' } }
                ];
            }
            
            if (genero) {
                filtro.genero = { $regex: genero, $options: 'i' };
            }

            // Buscar com paginação
            const [filmes, total] = await Promise.all([
                collection.find(filtro)
                    .sort({ nome: 1 })
                    .skip(skip)
                    .limit(limit)
                    .toArray(),
                collection.countDocuments(filtro)
            ]);

            return {
                success: true,
                message: `${filmes.length} filme(s) encontrado(s)`,
                data: filmes,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                    hasNext: page * limit < total,
                    hasPrev: page > 1
                }
            };

        } catch (error) {
            console.error('Erro ao buscar filmes:', error);
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
            if (!ObjectId.isValid(id)) {
                return {
                    success: false,
                    message: 'ID inválido',
                    data: null
                };
            }

            await connectToDatabase();
            const collection = getCollection();

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
            console.error('Erro ao buscar filme:', error);
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

            const filmes = await collection
                .find({ genero: { $regex: genero, $options: 'i' } })
                .sort({ nome: 1 })
                .toArray();

            return {
                success: true,
                message: `${filmes.length} filme(s) encontrado(s) no gênero "${genero}"`,
                data: filmes
            };

        } catch (error) {
            console.error('Erro ao buscar filmes por gênero:', error);
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
            if (!ObjectId.isValid(id)) {
                return {
                    success: false,
                    message: 'ID inválido',
                    data: null
                };
            }

            const validation = Filme.validate(filmeData);
            if (!validation.isValid) {
                return {
                    success: false,
                    message: 'Dados inválidos: ' + validation.errors.join(', '),
                    data: null
                };
            }

            await connectToDatabase();
            const collection = getCollection();

            const filmeExistente = await collection.findOne({ _id: new ObjectId(id) });
            if (!filmeExistente) {
                return {
                    success: false,
                    message: 'Filme não encontrado',
                    data: null
                };
            }

            const filme = this.#parseFilmeData(filmeData);
            await collection.updateOne(
                { _id: new ObjectId(id) },
                { $set: filme.toJSON() }
            );

            return {
                success: true,
                message: 'Filme atualizado com sucesso!',
                data: {
                    id: id,
                    filme: filme.toJSON()
                }
            };

        } catch (error) {
            console.error('Erro ao atualizar filme:', error);
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
            if (!ObjectId.isValid(id)) {
                return {
                    success: false,
                    message: 'ID inválido',
                    data: null
                };
            }

            await connectToDatabase();
            const collection = getCollection();

            const filmeExistente = await collection.findOne({ _id: new ObjectId(id) });
            if (!filmeExistente) {
                return {
                    success: false,
                    message: 'Filme não encontrado',
                    data: null
                };
            }

            await collection.deleteOne({ _id: new ObjectId(id) });

            return {
                success: true,
                message: 'Filme deletado com sucesso!',
                data: {
                    id: id,
                    filme: filmeExistente
                }
            };

        } catch (error) {
            console.error('Erro ao deletar filme:', error);
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
            console.error('Erro ao deletar filmes:', error);
            return {
                success: false,
                message: 'Erro ao deletar filmes: ' + error.message,
                data: null
            };
        }
    }

    // Estatísticas do catálogo
    static async obterEstatisticas() {
        try {
            await connectToDatabase();
            const collection = getCollection();

            const [total, porGenero, mediaAvaliacao] = await Promise.all([
                collection.countDocuments(),
                collection.aggregate([
                    { $group: { _id: '$genero', count: { $sum: 1 } } },
                    { $sort: { count: -1 } }
                ]).toArray(),
                collection.aggregate([
                    { $match: { avaliacao: { $gt: 0 } } },
                    { $group: { _id: null, media: { $avg: '$avaliacao' } } }
                ]).toArray()
            ]);

            return {
                success: true,
                message: 'Estatísticas obtidas com sucesso',
                data: {
                    totalFilmes: total,
                    filmesPorGenero: porGenero,
                    mediaAvaliacao: mediaAvaliacao[0]?.media?.toFixed(1) || 0
                }
            };

        } catch (error) {
            console.error('Erro ao obter estatísticas:', error);
            return {
                success: false,
                message: 'Erro ao obter estatísticas: ' + error.message,
                data: null
            };
        }
    }
}

module.exports = FilmeController;

