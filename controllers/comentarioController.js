const { connectToDatabase, ObjectId } = require('../config/database');
const Comentario = require('../models/Comentario');

// Nome da coleção de comentários
const COLLECTION_NAME = 'Comentarios';

class ComentarioController {

    // Helper para obter a coleção de comentários
    static async #getCollection() {
        const { db } = await connectToDatabase();
        return db.collection(COLLECTION_NAME);
    }

    // CREATE - Criar um novo comentário
    static async criarComentario(comentarioData) {
        try {
            // Validar dados
            const validation = Comentario.validate(comentarioData);
            if (!validation.isValid) {
                return {
                    success: false,
                    message: 'Dados inválidos: ' + validation.errors.join(', '),
                    data: null
                };
            }

            // Verificar se o filme existe
            if (!ObjectId.isValid(comentarioData.filmeId)) {
                return {
                    success: false,
                    message: 'ID do filme inválido',
                    data: null
                };
            }

            const collection = await this.#getCollection();

            const comentario = new Comentario(
                comentarioData.filmeId,
                comentarioData.autor.trim(),
                comentarioData.texto.trim(),
                comentarioData.avaliacao ? parseFloat(comentarioData.avaliacao) : 0
            );

            const result = await collection.insertOne(comentario.toJSON());

            return {
                success: true,
                message: 'Comentário adicionado com sucesso!',
                data: {
                    id: result.insertedId,
                    comentario: comentario.toJSON()
                }
            };

        } catch (error) {
            console.error('Erro ao criar comentário:', error);
            return {
                success: false,
                message: 'Erro ao criar comentário: ' + error.message,
                data: null
            };
        }
    }

    // READ - Buscar comentários de um filme
    static async buscarComentariosPorFilme(filmeId) {
        try {
            if (!ObjectId.isValid(filmeId)) {
                return {
                    success: false,
                    message: 'ID do filme inválido',
                    data: null
                };
            }

            const collection = await this.#getCollection();

            const comentarios = await collection
                .find({ filmeId: filmeId })
                .sort({ dataCriacao: -1 }) // Mais recentes primeiro
                .toArray();

            return {
                success: true,
                message: `${comentarios.length} comentário(s) encontrado(s)`,
                data: comentarios
            };

        } catch (error) {
            console.error('Erro ao buscar comentários:', error);
            return {
                success: false,
                message: 'Erro ao buscar comentários: ' + error.message,
                data: null
            };
        }
    }

    // READ - Buscar um comentário por ID
    static async buscarComentarioPorId(id) {
        try {
            if (!ObjectId.isValid(id)) {
                return {
                    success: false,
                    message: 'ID inválido',
                    data: null
                };
            }

            const collection = await this.#getCollection();
            const comentario = await collection.findOne({ _id: new ObjectId(id) });

            if (!comentario) {
                return {
                    success: false,
                    message: 'Comentário não encontrado',
                    data: null
                };
            }

            return {
                success: true,
                message: 'Comentário encontrado',
                data: comentario
            };

        } catch (error) {
            console.error('Erro ao buscar comentário:', error);
            return {
                success: false,
                message: 'Erro ao buscar comentário: ' + error.message,
                data: null
            };
        }
    }

    // UPDATE - Atualizar comentário
    static async atualizarComentario(id, comentarioData) {
        try {
            if (!ObjectId.isValid(id)) {
                return {
                    success: false,
                    message: 'ID inválido',
                    data: null
                };
            }

            const collection = await this.#getCollection();

            const comentarioExistente = await collection.findOne({ _id: new ObjectId(id) });
            if (!comentarioExistente) {
                return {
                    success: false,
                    message: 'Comentário não encontrado',
                    data: null
                };
            }

            const updateData = {
                texto: comentarioData.texto?.trim() || comentarioExistente.texto,
                avaliacao: comentarioData.avaliacao !== undefined ? parseFloat(comentarioData.avaliacao) : comentarioExistente.avaliacao,
                dataEdicao: new Date()
            };

            await collection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updateData }
            );

            return {
                success: true,
                message: 'Comentário atualizado com sucesso!',
                data: {
                    id: id,
                    ...updateData
                }
            };

        } catch (error) {
            console.error('Erro ao atualizar comentário:', error);
            return {
                success: false,
                message: 'Erro ao atualizar comentário: ' + error.message,
                data: null
            };
        }
    }

    // DELETE - Deletar comentário
    static async deletarComentario(id) {
        try {
            if (!ObjectId.isValid(id)) {
                return {
                    success: false,
                    message: 'ID inválido',
                    data: null
                };
            }

            const collection = await this.#getCollection();

            const comentarioExistente = await collection.findOne({ _id: new ObjectId(id) });
            if (!comentarioExistente) {
                return {
                    success: false,
                    message: 'Comentário não encontrado',
                    data: null
                };
            }

            await collection.deleteOne({ _id: new ObjectId(id) });

            return {
                success: true,
                message: 'Comentário deletado com sucesso!',
                data: {
                    id: id,
                    comentario: comentarioExistente
                }
            };

        } catch (error) {
            console.error('Erro ao deletar comentário:', error);
            return {
                success: false,
                message: 'Erro ao deletar comentário: ' + error.message,
                data: null
            };
        }
    }

    // DELETE - Deletar todos os comentários de um filme
    static async deletarComentariosDoFilme(filmeId) {
        try {
            if (!ObjectId.isValid(filmeId)) {
                return {
                    success: false,
                    message: 'ID do filme inválido',
                    data: null
                };
            }

            const collection = await this.#getCollection();
            const result = await collection.deleteMany({ filmeId: filmeId });

            return {
                success: true,
                message: `${result.deletedCount} comentário(s) deletado(s)`,
                data: {
                    deletedCount: result.deletedCount
                }
            };

        } catch (error) {
            console.error('Erro ao deletar comentários:', error);
            return {
                success: false,
                message: 'Erro ao deletar comentários: ' + error.message,
                data: null
            };
        }
    }

    // Estatísticas de comentários de um filme
    static async obterEstatisticasFilme(filmeId) {
        try {
            if (!ObjectId.isValid(filmeId)) {
                return {
                    success: false,
                    message: 'ID do filme inválido',
                    data: null
                };
            }

            const collection = await this.#getCollection();

            const stats = await collection.aggregate([
                { $match: { filmeId: filmeId } },
                {
                    $group: {
                        _id: null,
                        totalComentarios: { $sum: 1 },
                        mediaAvaliacao: { $avg: '$avaliacao' }
                    }
                }
            ]).toArray();

            return {
                success: true,
                message: 'Estatísticas obtidas',
                data: {
                    totalComentarios: stats[0]?.totalComentarios || 0,
                    mediaAvaliacao: stats[0]?.mediaAvaliacao?.toFixed(1) || 0
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

module.exports = ComentarioController;
