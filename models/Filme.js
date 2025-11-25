// Modelo para representar um filme
class Filme {
    constructor(nome, genero, anolancemento) {
        this.nome = nome;
        this.genero = genero;
        this.anolancemento = anolancemento;
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
            anolancemento: this.anolancemento
        };
    }

    // Cria um filme a partir de um objeto
    static fromObject(obj) {
        return new Filme(obj.nome, obj.genero, obj.anolancemento);
    }
}

module.exports = Filme;


