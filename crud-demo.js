const FilmeController = require('./controllers/filmeController');
const { closeConnection } = require('./config/database');

// Função para demonstrar o CRUD
async function demonstrarCRUD() {
    console.log('=== DEMONSTRAÇÃO DO CRUD DE FILMES ===\n');

    try {
        // 1. CREATE - Criar alguns filmes
        console.log('1. CRIANDO FILMES...');

        const filmesParaCriar = [
            { nome: "The Batman", genero: "ação", anolancemento: 2022 },
            { nome: "Spider-Man: No Way Home", genero: "ação", anolancemento: 2021 },
            { nome: "Encanto", genero: "animação", anolancemento: 2021 },
            { nome: "Duna", genero: "ficção científica", anolancemento: 2021 },
            { nome: "Top Gun: Maverick", genero: "ação", anolancemento: 2022 }
        ];

        const filmesCriados = [];
        for (const filmeData of filmesParaCriar) {
            const resultado = await FilmeController.criarFilme(filmeData);
            if (resultado.success) {
                console.log(`✅ ${resultado.message} - ID: ${resultado.data.id}`);
                filmesCriados.push(resultado.data.id);
            } else {
                console.log(`❌ ${resultado.message}`);
            }
        }

        console.log('\n2. BUSCANDO TODOS OS FILMES...');
        const todosFilmes = await FilmeController.buscarTodosFilmes();
        if (todosFilmes.success) {
            console.log(`✅ ${todosFilmes.message}`);
            todosFilmes.data.forEach(filme => {
                console.log(`   - ${filme.nome} (${filme.genero}, ${filme.anolancemento})`);
            });
        } else {
            console.log(`❌ ${todosFilmes.message}`);
        }

        // 3. READ - Buscar filme por ID
        if (filmesCriados.length > 0) {
            console.log('\n3. BUSCANDO FILME POR ID...');
            const filmePorId = await FilmeController.buscarFilmePorId(filmesCriados[0]);
            if (filmePorId.success) {
                console.log(`✅ ${filmePorId.message}`);
                console.log(`   - ${filmePorId.data.nome} (${filmePorId.data.genero}, ${filmePorId.data.anolancemento})`);
            } else {
                console.log(`❌ ${filmePorId.message}`);
            }
        }

        // 4. READ - Buscar filmes por gênero
        console.log('\n4. BUSCANDO FILMES POR GÊNERO (ação)...');
        const filmesPorGenero = await FilmeController.buscarFilmesPorGenero('ação');
        if (filmesPorGenero.success) {
            console.log(`✅ ${filmesPorGenero.message}`);
            filmesPorGenero.data.forEach(filme => {
                console.log(`   - ${filme.nome} (${filme.anolancemento})`);
            });
        } else {
            console.log(`❌ ${filmesPorGenero.message}`);
        }

        // 5. UPDATE - Atualizar um filme
        if (filmesCriados.length > 0) {
            console.log('\n5. ATUALIZANDO FILME...');
            const dadosAtualizados = {
                nome: "The Batman - Edição Especial",
                genero: "ação",
                anolancemento: 2023
            };

            const resultadoUpdate = await FilmeController.atualizarFilme(filmesCriados[0], dadosAtualizados);
            if (resultadoUpdate.success) {
                console.log(`✅ ${resultadoUpdate.message}`);
                console.log(`   - ${resultadoUpdate.data.filme.nome} (${resultadoUpdate.data.filme.genero}, ${resultadoUpdate.data.filme.anolancemento})`);
            } else {
                console.log(`❌ ${resultadoUpdate.message}`);
            }
        }

        // 6. DELETE - Deletar um filme específico
        if (filmesCriados.length > 1) {
            console.log('\n6. DELETANDO FILME ESPECÍFICO...');
            const resultadoDelete = await FilmeController.deletarFilme(filmesCriados[1]);
            if (resultadoDelete.success) {
                console.log(`✅ ${resultadoDelete.message}`);
            } else {
                console.log(`❌ ${resultadoDelete.message}`);
            }
        }

        // 7. Verificar filmes restantes
        console.log('\n7. FILMES RESTANTES...');
        const filmesRestantes = await FilmeController.buscarTodosFilmes();
        if (filmesRestantes.success) {
            console.log(`✅ ${filmesRestantes.message}`);
            filmesRestantes.data.forEach(filme => {
                console.log(`   - ${filme.nome} (${filme.genero}, ${filme.anolancemento})`);
            });
        }

        console.log('\n=== DEMONSTRAÇÃO CONCLUÍDA ===');

    } catch (error) {
        console.error('Erro durante a demonstração:', error);
    } finally {
        // Fechar conexão
        await closeConnection();
    }
}

// Executar demonstração se este arquivo for executado diretamente
if (require.main === module) {
    demonstrarCRUD().catch(console.error);
}

module.exports = { demonstrarCRUD };

