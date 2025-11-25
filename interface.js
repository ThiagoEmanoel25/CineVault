const readline = require('readline');
const FilmeController = require('./controllers/filmeController');
const { closeConnection } = require('./config/database');

// Interface de linha de comando
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Função para fazer perguntas
function perguntar(questao) {
    return new Promise((resolve) => {
        rl.question(questao, resolve);
    });
}

// Função para mostrar o menu
function mostrarMenu() {
    console.log('\n=== MENU CRUD FILMES ===');
    console.log('1. Criar filme');
    console.log('2. Listar todos os filmes');
    console.log('3. Buscar filme por ID');
    console.log('4. Buscar filmes por gênero');
    console.log('5. Atualizar filme');
    console.log('6. Deletar filme');
    console.log('7. Deletar todos os filmes');
    console.log('8. Executar demonstração completa');
    console.log('0. Sair');
    console.log('========================\n');
}

// Função para criar filme
async function criarFilme() {
    try {
        console.log('\n--- CRIAR FILME ---');

        const nome = await perguntar('Nome do filme: ');
        const genero = await perguntar('Gênero: ');
        const anolancemento = await perguntar('Ano de lançamento: ');

        const resultado = await FilmeController.criarFilme({
            nome: nome.trim(),
            genero: genero.trim(),
            anolancemento: parseInt(anolancemento)
        });

        if (resultado.success) {
            console.log(`\n✅ ${resultado.message}`);
            console.log(`ID: ${resultado.data.id}`);
        } else {
            console.log(`\n❌ ${resultado.message}`);
        }
    } catch (error) {
        console.log(`\n❌ Erro: ${error.message}`);
    }
}

// Função para listar filmes
async function listarFilmes() {
    try {
        console.log('\n--- LISTAR TODOS OS FILMES ---');

        const resultado = await FilmeController.buscarTodosFilmes();

        if (resultado.success && resultado.data.length > 0) {
            console.log(`\n✅ ${resultado.message}`);
            resultado.data.forEach((filme, index) => {
                console.log(`${index + 1}. ${filme.nome} (${filme.genero}, ${filme.anolancemento}) - ID: ${filme._id}`);
            });
        } else {
            console.log('\n📝 Nenhum filme encontrado no banco de dados.');
        }
    } catch (error) {
        console.log(`\n❌ Erro: ${error.message}`);
    }
}

// Função para buscar filme por ID
async function buscarPorId() {
    try {
        console.log('\n--- BUSCAR FILME POR ID ---');

        const id = await perguntar('Digite o ID do filme: ');

        const resultado = await FilmeController.buscarFilmePorId(id.trim());

        if (resultado.success) {
            console.log(`\n✅ ${resultado.message}`);
            const filme = resultado.data;
            console.log(`Nome: ${filme.nome}`);
            console.log(`Gênero: ${filme.genero}`);
            console.log(`Ano: ${filme.anolancemento}`);
            console.log(`ID: ${filme._id}`);
        } else {
            console.log(`\n❌ ${resultado.message}`);
        }
    } catch (error) {
        console.log(`\n❌ Erro: ${error.message}`);
    }
}

// Função para buscar filmes por gênero
async function buscarPorGenero() {
    try {
        console.log('\n--- BUSCAR FILMES POR GÊNERO ---');

        const genero = await perguntar('Digite o gênero: ');

        const resultado = await FilmeController.buscarFilmesPorGenero(genero.trim());

        if (resultado.success && resultado.data.length > 0) {
            console.log(`\n✅ ${resultado.message}`);
            resultado.data.forEach((filme, index) => {
                console.log(`${index + 1}. ${filme.nome} (${filme.anolancemento}) - ID: ${filme._id}`);
            });
        } else {
            console.log('\n📝 Nenhum filme encontrado com este gênero.');
        }
    } catch (error) {
        console.log(`\n❌ Erro: ${error.message}`);
    }
}

// Função para atualizar filme
async function atualizarFilme() {
    try {
        console.log('\n--- ATUALIZAR FILME ---');

        const id = await perguntar('Digite o ID do filme: ');

        // Verificar se o filme existe
        const filmeExistente = await FilmeController.buscarFilmePorId(id.trim());
        if (!filmeExistente.success) {
            console.log(`\n❌ ${filmeExistente.message}`);
            return;
        }

        console.log(`\nFilme atual: ${filmeExistente.data.nome} (${filmeExistente.data.genero}, ${filmeExistente.data.anolancemento})`);

        const nome = await perguntar(`Novo nome (atual: ${filmeExistente.data.nome}): `);
        const genero = await perguntar(`Novo gênero (atual: ${filmeExistente.data.genero}): `);
        const anolancemento = await perguntar(`Novo ano (atual: ${filmeExistente.data.anolancemento}): `);

        const dadosAtualizados = {
            nome: nome.trim() || filmeExistente.data.nome,
            genero: genero.trim() || filmeExistente.data.genero,
            anolancemento: anolancemento.trim() ? parseInt(anolancemento) : filmeExistente.data.anolancemento
        };

        const resultado = await FilmeController.atualizarFilme(id.trim(), dadosAtualizados);

        if (resultado.success) {
            console.log(`\n✅ ${resultado.message}`);
        } else {
            console.log(`\n❌ ${resultado.message}`);
        }
    } catch (error) {
        console.log(`\n❌ Erro: ${error.message}`);
    }
}

// Função para deletar filme
async function deletarFilme() {
    try {
        console.log('\n--- DELETAR FILME ---');

        const id = await perguntar('Digite o ID do filme: ');

        const resultado = await FilmeController.deletarFilme(id.trim());

        if (resultado.success) {
            console.log(`\n✅ ${resultado.message}`);
        } else {
            console.log(`\n❌ ${resultado.message}`);
        }
    } catch (error) {
        console.log(`\n❌ Erro: ${error.message}`);
    }
}

// Função para deletar todos os filmes
async function deletarTodos() {
    try {
        console.log('\n--- DELETAR TODOS OS FILMES ---');

        const confirmacao = await perguntar('⚠️  ATENÇÃO: Isso irá deletar TODOS os filmes! Digite "CONFIRMAR" para continuar: ');

        if (confirmacao.trim().toUpperCase() === 'CONFIRMAR') {
            const resultado = await FilmeController.deletarTodosFilmes();

            if (resultado.success) {
                console.log(`\n✅ ${resultado.message}`);
            } else {
                console.log(`\n❌ ${resultado.message}`);
            }
        } else {
            console.log('\n❌ Operação cancelada.');
        }
    } catch (error) {
        console.log(`\n❌ Erro: ${error.message}`);
    }
}

// Função para executar demonstração
async function executarDemonstracao() {
    try {
        console.log('\n--- EXECUTANDO DEMONSTRAÇÃO COMPLETA ---');

        const { demonstrarCRUD } = require('./crud-demo');
        await demonstrarCRUD();

        console.log('\n✅ Demonstração concluída!');
    } catch (error) {
        console.log(`\n❌ Erro: ${error.message}`);
    }
}

// Função principal do menu
async function menuPrincipal() {
    while (true) {
        mostrarMenu();

        const opcao = await perguntar('Escolha uma opção: ');

        switch (opcao.trim()) {
            case '1':
                await criarFilme();
                break;
            case '2':
                await listarFilmes();
                break;
            case '3':
                await buscarPorId();
                break;
            case '4':
                await buscarPorGenero();
                break;
            case '5':
                await atualizarFilme();
                break;
            case '6':
                await deletarFilme();
                break;
            case '7':
                await deletarTodos();
                break;
            case '8':
                await executarDemonstracao();
                break;
            case '0':
                console.log('\n👋 Saindo do sistema...');
                await closeConnection();
                rl.close();
                return;
            default:
                console.log('\n❌ Opção inválida! Tente novamente.');
        }

        // Pausa antes de mostrar o menu novamente
        await perguntar('\nPressione Enter para continuar...');
    }
}

// Iniciar a aplicação
console.log('🎬 Bem-vindo ao Sistema CRUD de Filmes!');
menuPrincipal().catch(console.error);

