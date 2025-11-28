// Modelo para representar um comentário de filme
class Comentario {
    constructor(filmeId, autor, texto, avaliacao = 0) {
        this.filmeId = filmeId;
        this.autor = autor;
        this.texto = texto;
        this.avaliacao = avaliacao; // de 0 a 10
        this.dataCriacao = new Date();
    }

    // Validação dos dados do comentário
    static validate(comentario) {
        const errors = [];

        if (!comentario.filmeId || typeof comentario.filmeId !== 'string') {
            errors.push('ID do filme é obrigatório');
        }

        if (!comentario.autor || typeof comentario.autor !== 'string' || comentario.autor.trim() === '') {
            errors.push('Nome do autor é obrigatório');
        }

        if (!comentario.texto || typeof comentario.texto !== 'string' || comentario.texto.trim() === '') {
            errors.push('Texto do comentário é obrigatório');
        }

        if (comentario.texto && comentario.texto.length > 1000) {
            errors.push('Comentário deve ter no máximo 1000 caracteres');
        }

        if (comentario.avaliacao !== undefined && comentario.avaliacao !== null && comentario.avaliacao !== '') {
            const avaliacaoNum = typeof comentario.avaliacao === 'string' ? parseFloat(comentario.avaliacao) : comentario.avaliacao;
            if (isNaN(avaliacaoNum) || avaliacaoNum < 0 || avaliacaoNum > 10) {
                errors.push('Avaliação deve ser um número entre 0 e 10');
            }
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Converte para objeto JSON
    toJSON() {
        return {
            filmeId: this.filmeId,
            autor: this.autor,
            texto: this.texto,
            avaliacao: this.avaliacao,
            dataCriacao: this.dataCriacao
        };
    }

    // Cria um comentário a partir de um objeto
    static fromObject(obj) {
        const comentario = new Comentario(
            obj.filmeId,
            obj.autor,
            obj.texto,
            obj.avaliacao || 0
        );
        if (obj.dataCriacao) {
            comentario.dataCriacao = new Date(obj.dataCriacao);
        }
        return comentario;
    }
}

module.exports = Comentario;
