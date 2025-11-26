// Modelo para representar um filme
class Filme {
    constructor(nome, genero, anolancemento, diretor = '', duracao = 0, avaliacao = 0, sinopse = '', poster = '') {
        this.nome = nome;
        this.genero = genero;
        this.anolancemento = anolancemento;
        this.diretor = diretor;
        this.duracao = duracao; // em minutos
        this.avaliacao = avaliacao; // de 0 a 10
        this.sinopse = sinopse;
        this.poster = poster; // URL da imagem
    }

    // Validação dos dados do filme
    static validate(filme) {
        const errors = [];

        if (!filme.nome || typeof filme.nome !== 'string' || filme.nome.trim() === '') {
            errors.push('Nome é obrigatório e deve ser uma string não vazia');
        }

        if (!filme.genero || typeof filme.genero !== 'string' || filme.genero.trim() === '') {
            errors.push('Gênero é obrigatório e deve ser uma string não vazia');
        }

        if (!filme.anolancemento || typeof filme.anolancemento !== 'number' || filme.anolancemento < 1800 || filme.anolancemento > new Date().getFullYear() + 5) {
            errors.push('Ano de lançamento é obrigatório e deve ser um número válido entre 1800 e ' + (new Date().getFullYear() + 5));
        }

        // Validação opcional para duração (só valida se fornecida e > 0)
        if (filme.duracao !== undefined && filme.duracao !== null && filme.duracao !== '') {
            const duracaoNum = typeof filme.duracao === 'string' ? parseInt(filme.duracao) : filme.duracao;
            if (isNaN(duracaoNum) || duracaoNum < 0 || duracaoNum > 600) {
                errors.push('Duração deve ser um número entre 0 e 600 minutos');
            }
        }

        // Validação opcional para avaliação (só valida se fornecida e > 0)
        if (filme.avaliacao !== undefined && filme.avaliacao !== null && filme.avaliacao !== '') {
            const avaliacaoNum = typeof filme.avaliacao === 'string' ? parseFloat(filme.avaliacao) : filme.avaliacao;
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
            nome: this.nome,
            genero: this.genero,
            anolancemento: this.anolancemento,
            diretor: this.diretor,
            duracao: this.duracao,
            avaliacao: this.avaliacao,
            sinopse: this.sinopse,
            poster: this.poster
        };
    }

    // Cria um filme a partir de um objeto
    static fromObject(obj) {
        return new Filme(
            obj.nome,
            obj.genero,
            obj.anolancemento,
            obj.diretor || '',
            obj.duracao || 0,
            obj.avaliacao || 0,
            obj.sinopse || '',
            obj.poster || ''
        );
    }
}

module.exports = Filme;



