// ========================================
// CineVault - Modern Movie Catalog App
// ========================================

const API_BASE_URL = window.location.origin + '/api';

// Estado da aplicação
let filmes = [];
let editingId = null;
let currentFilter = 'all';
let sortBy = 'nome';
let searchTimeout = null;

// Elementos DOM
const filmeForm = document.getElementById('filme-form');
const nomeInput = document.getElementById('nome');
const generoInput = document.getElementById('genero');
const anolancementoInput = document.getElementById('anolancemento');
const diretorInput = document.getElementById('diretor');
const duracaoInput = document.getElementById('duracao');
const avaliacaoInput = document.getElementById('avaliacao');
const sinopseInput = document.getElementById('sinopse');
const posterInput = document.getElementById('poster');
const filmeIdInput = document.getElementById('filme-id');
const submitBtn = document.getElementById('submit-btn');
const formTitle = document.getElementById('form-title');
const filmesContainer = document.getElementById('filmes-container');
const emptyState = document.getElementById('empty-state');
const filmesCount = document.getElementById('filmes-count');
const searchInput = document.getElementById('search-input');
const loading = document.getElementById('loading');
const formModal = document.getElementById('form-modal');

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    carregarFilmes();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // Form
    filmeForm?.addEventListener('submit', handleSubmit);
    searchInput?.addEventListener('input', handleSearch);

    // Botão adicionar filme
    document.getElementById('add-filme-btn')?.addEventListener('click', abrirModal);

    // Filtros
    document.getElementById('filter-all')?.addEventListener('click', () => setFilter('all'));
    document.getElementById('filter-acao')?.addEventListener('click', () => setFilter('ação'));
    document.getElementById('filter-drama')?.addEventListener('click', () => setFilter('drama'));
    document.getElementById('filter-comedia')?.addEventListener('click', () => setFilter('comédia'));
    document.getElementById('filter-ficcao')?.addEventListener('click', () => setFilter('ficção'));
    document.getElementById('filter-terror')?.addEventListener('click', () => setFilter('terror'));

    // Ordenação
    document.querySelectorAll('.btn-sort').forEach(btn => {
        btn.addEventListener('click', () => {
            const sort = btn.dataset.sort;
            setSort(sort);
        });
    });

    // Exportar/Importar
    document.getElementById('export-btn')?.addEventListener('click', exportarFilmes);
    document.getElementById('import-btn')?.addEventListener('click', () => {
        document.getElementById('import-input')?.click();
    });
    document.getElementById('import-input')?.addEventListener('change', importarFilmes);

    // Fechar modais com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            fecharFormModal();
            fecharDetalhes();
            document.getElementById('modal')?.classList.remove('show');
        }
    });
}

// Validação do formulário
function validarFormulario() {
    const nome = nomeInput.value.trim();
    const genero = generoInput.value.trim();
    const ano = parseInt(anolancementoInput.value);
    const duracao = duracaoInput.value ? parseInt(duracaoInput.value) : 0;
    const avaliacao = avaliacaoInput.value ? parseFloat(avaliacaoInput.value) : 0;

    if (nome.length < 2) {
        showToast('Nome deve ter pelo menos 2 caracteres', 'error');
        nomeInput.focus();
        return false;
    }

    if (genero.length < 2) {
        showToast('Gênero deve ter pelo menos 2 caracteres', 'error');
        generoInput.focus();
        return false;
    }

    const anoAtual = new Date().getFullYear();
    if (!ano || ano < 1800 || ano > anoAtual + 5) {
        showToast(`Ano deve estar entre 1800 e ${anoAtual + 5}`, 'error');
        anolancementoInput.focus();
        return false;
    }

    if (duracao < 0 || duracao > 600) {
        showToast('Duração deve estar entre 0 e 600 minutos', 'error');
        duracaoInput.focus();
        return false;
    }

    if (avaliacao < 0 || avaliacao > 10) {
        showToast('Avaliação deve estar entre 0 e 10', 'error');
        avaliacaoInput.focus();
        return false;
    }

    return true;
}

// Carregar filmes com cache
async function carregarFilmes() {
    // Tentar carregar do cache primeiro
    const cached = carregarFilmesLocal();
    if (cached && cached.length > 0) {
        filmes = cached;
        renderizarFilmes();
        calcularEstatisticas();
    }

    try {
        showLoading(true);
        const result = await fazerRequisicao(`${API_BASE_URL}/filmes`);

        if (result.success) {
            filmes = result.data || [];
            salvarFilmesLocal(filmes);
            renderizarFilmes();
            calcularEstatisticas();
        } else {
            showToast('Erro ao carregar filmes', 'error');
        }
    } catch (error) {
        console.error('Erro:', error);
        if (filmes.length === 0) {
            showToast('Erro ao conectar com o servidor. Usando cache local.', 'error');
        }
    } finally {
        showLoading(false);
    }
}

// Cache LocalStorage
function salvarFilmesLocal(filmes) {
    try {
        localStorage.setItem('filmes_cache', JSON.stringify(filmes));
        localStorage.setItem('filmes_cache_time', Date.now().toString());
    } catch (error) {
        console.error('Erro ao salvar cache:', error);
    }
}

function carregarFilmesLocal() {
    try {
        const cache = localStorage.getItem('filmes_cache');
        const cacheTime = localStorage.getItem('filmes_cache_time');

        // Cache válido por 5 minutos
        if (cache && cacheTime && (Date.now() - parseInt(cacheTime) < 300000)) {
            return JSON.parse(cache);
        }
    } catch (error) {
        console.error('Erro ao carregar cache:', error);
    }
    return null;
}

// Requisição HTTP melhorada
async function fazerRequisicao(url, options = {}) {
    try {
        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        };

        // Se tiver body, garantir que seja string JSON
        if (config.body && typeof config.body !== 'string') {
            config.body = JSON.stringify(config.body);
        }

        console.log('Fazendo requisição para:', url, config);

        const response = await fetch(url, config);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Erro na resposta:', response.status, errorText);
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Resposta recebida:', result);
        return result;
    } catch (error) {
        console.error('Erro na requisição:', error);

        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            showToast('Sem conexão com o servidor. Verifique se o servidor está rodando.', 'error');
        } else {
            showToast('Erro: ' + error.message, 'error');
        }

        throw error;
    }
}

// Renderizar filmes com ordenação
function renderizarFilmes() {
    let filmesFiltrados = [...filmes];

    // Aplicar filtro de gênero
    if (currentFilter !== 'all') {
        filmesFiltrados = filmesFiltrados.filter(filme =>
            filme.genero.toLowerCase().includes(currentFilter.toLowerCase())
        );
    }

    // Aplicar busca
    const searchTerm = searchInput?.value?.toLowerCase() || '';
    if (searchTerm) {
        filmesFiltrados = filmesFiltrados.filter(filme =>
            filme.nome.toLowerCase().includes(searchTerm) ||
            filme.genero.toLowerCase().includes(searchTerm) ||
            (filme.diretor && filme.diretor.toLowerCase().includes(searchTerm)) ||
            (filme.sinopse && filme.sinopse.toLowerCase().includes(searchTerm))
        );
    }

    // Ordenar
    filmesFiltrados.sort((a, b) => {
        switch (sortBy) {
            case 'nome':
                return a.nome.localeCompare(b.nome);
            case 'ano':
                return b.anolancemento - a.anolancemento;
            case 'avaliacao':
                return (b.avaliacao || 0) - (a.avaliacao || 0);
            default:
                return 0;
        }
    });

    // Atualizar contador
    if (filmesCount) {
        filmesCount.textContent = `${filmesFiltrados.length} filme${filmesFiltrados.length !== 1 ? 's' : ''}`;
    }

    // Renderizar
    if (filmesFiltrados.length === 0) {
        if (filmesContainer) filmesContainer.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
    } else {
        if (filmesContainer) filmesContainer.style.display = 'grid';
        if (emptyState) emptyState.style.display = 'none';

        if (filmesContainer) {
            filmesContainer.innerHTML = filmesFiltrados.map(filme => {
                const posterUrl = (filme.poster && filme.poster.trim())
                    ? filme.poster
                    : gerarPlaceholderSVG(filme.nome, 300, 450);
                const placeholderUrl = gerarPlaceholderSVG(filme.nome, 300, 450);
                const avaliacao = (filme.avaliacao && filme.avaliacao > 0) ? filme.avaliacao.toFixed(1) : null;

                return `
                    <div class="filme-card" onclick="verDetalhes('${filme._id}')">
                        <img src="${escapeHtml(posterUrl)}" alt="${escapeHtml(filme.nome)}" class="filme-poster" onerror="this.src='${placeholderUrl}'">
                        <div class="filme-content">
                            <div class="filme-nome">${escapeHtml(filme.nome)}</div>
                            <div class="filme-meta">
                                <span class="filme-ano">${filme.anolancemento}</span>
                                ${avaliacao ? `<span class="filme-rating">⭐ ${avaliacao}</span>` : ''}
                            </div>
                            <span class="filme-genero">${escapeHtml(filme.genero)}</span>
                        </div>
                        <div class="filme-actions" onclick="event.stopPropagation()">
                            <button class="btn btn-ghost" onclick="editarFilme('${filme._id}')" title="Editar">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                            </button>
                            <button class="btn btn-danger" onclick="confirmarDeletar('${filme._id}')" title="Excluir">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }
}

// Handle Submit
async function handleSubmit(e) {
    e.preventDefault();

    if (!validarFormulario()) {
        return;
    }

    // Coletar dados do formulário de forma segura
    const nome = nomeInput ? nomeInput.value.trim() : '';
    const genero = generoInput ? generoInput.value.trim() : '';
    const anolancemento = anolancementoInput ? parseInt(anolancementoInput.value) : 0;
    const diretor = diretorInput && diretorInput.value ? diretorInput.value.trim() : '';
    const duracao = duracaoInput && duracaoInput.value ? parseInt(duracaoInput.value) : 0;
    const avaliacao = avaliacaoInput && avaliacaoInput.value ? parseFloat(avaliacaoInput.value) : 0;
    const sinopse = sinopseInput && sinopseInput.value ? sinopseInput.value.trim() : '';
    const poster = posterInput && posterInput.value ? posterInput.value.trim() : '';

    const filmeData = {
        nome: nome,
        genero: genero,
        anolancemento: anolancemento,
        diretor: diretor,
        duracao: duracao,
        avaliacao: avaliacao,
        sinopse: sinopse,
        poster: poster
    };

    console.log('Dados do filme a serem enviados:', filmeData);

    try {
        let result;
        if (editingId) {
            result = await fazerRequisicao(`${API_BASE_URL}/filmes/${editingId}`, {
                method: 'PUT',
                body: JSON.stringify(filmeData)
            });
        } else {
            result = await fazerRequisicao(`${API_BASE_URL}/filmes`, {
                method: 'POST',
                body: JSON.stringify(filmeData)
            });
        }

        if (result.success) {
            showToast(
                editingId ? 'Filme atualizado com sucesso!' : 'Filme adicionado com sucesso!',
                'success'
            );
            fecharFormModal();
            carregarFilmes();
        } else {
            // Melhorar mensagem de erro
            const mensagemErro = result.message || 'Erro ao salvar filme';
            console.error('Erro ao salvar:', result);
            showToast(mensagemErro, 'error');
        }
    } catch (error) {
        console.error('Erro:', error);
        showToast('Erro ao conectar com o servidor', 'error');
    }
}

// Editar filme
async function editarFilme(id) {
    try {
        const result = await fazerRequisicao(`${API_BASE_URL}/filmes/${id}`);

        if (result.success) {
            const filme = result.data;
            if (nomeInput) nomeInput.value = filme.nome || '';
            if (generoInput) generoInput.value = filme.genero || '';
            if (anolancementoInput) anolancementoInput.value = filme.anolancemento || '';
            if (diretorInput) diretorInput.value = filme.diretor || '';
            if (duracaoInput) duracaoInput.value = filme.duracao || '';
            if (avaliacaoInput) avaliacaoInput.value = filme.avaliacao || '';
            if (sinopseInput) sinopseInput.value = filme.sinopse || '';
            if (posterInput) posterInput.value = filme.poster || '';
            if (filmeIdInput) filmeIdInput.value = filme._id;
            editingId = filme._id;

            if (formTitle) formTitle.textContent = 'Editar Filme';
            if (submitBtn) submitBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Atualizar Filme
            `;

            // Abrir modal
            if (formModal) formModal.classList.add('show');
        } else {
            showToast('Erro ao carregar filme', 'error');
        }
    } catch (error) {
        console.error('Erro:', error);
        showToast('Erro ao conectar com o servidor', 'error');
    }
}

// Abrir modal de formulário
function abrirModal() {
    resetForm();
    if (formModal) formModal.classList.add('show');
}

// Fechar modal de formulário
function fecharFormModal() {
    if (formModal) formModal.classList.remove('show');
    resetForm();
}

// Resetar formulário
function resetForm() {
    if (filmeForm) filmeForm.reset();
    if (filmeIdInput) filmeIdInput.value = '';
    editingId = null;
    if (formTitle) formTitle.textContent = 'Novo Filme';
    if (submitBtn) submitBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        Salvar Filme
    `;
}

// Confirmar deletar
function confirmarDeletar(id) {
    const filme = filmes.find(f => f._id === id);
    if (!filme) return;

    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalConfirm = document.getElementById('modal-confirm');

    modalTitle.textContent = 'Confirmar Exclusão';
    modalMessage.textContent = `Tem certeza que deseja deletar "${filme.nome}"? Esta ação não pode ser desfeita.`;

    modalConfirm.onclick = () => deletarFilme(id);

    modal.classList.add('show');

    document.querySelector('.close').onclick = () => modal.classList.remove('show');
    document.getElementById('modal-cancel').onclick = () => modal.classList.remove('show');
    modal.onclick = (e) => {
        if (e.target === modal) modal.classList.remove('show');
    };
}

// Deletar filme
async function deletarFilme(id) {
    try {
        const result = await fazerRequisicao(`${API_BASE_URL}/filmes/${id}`, {
            method: 'DELETE'
        });

        if (result.success) {
            showToast('Filme deletado com sucesso! 🗑️', 'success');
            document.getElementById('modal').classList.remove('show');
            carregarFilmes();
        } else {
            showToast(result.message || 'Erro ao deletar filme', 'error');
        }
    } catch (error) {
        console.error('Erro:', error);
        showToast('Erro ao conectar com o servidor', 'error');
    }
}

// Filtros
function setFilter(genero) {
    currentFilter = genero;

    document.querySelectorAll('.btn-filter').forEach(btn => {
        btn.classList.remove('active');
    });

    if (genero === 'all') {
        document.getElementById('filter-all')?.classList.add('active');
    } else {
        const btn = document.getElementById(`filter-${genero.toLowerCase()}`);
        if (btn) btn.classList.add('active');
    }

    renderizarFilmes();
}

// Ordenação
function setSort(criteria) {
    sortBy = criteria;

    document.querySelectorAll('.btn-sort').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.sort === criteria) {
            btn.classList.add('active');
        }
    });

    renderizarFilmes();
}

// Busca com debounce
function handleSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        renderizarFilmes();
    }, 300); // Aguarda 300ms após parar de digitar
}

// Estatísticas
function calcularEstatisticas() {
    if (filmes.length === 0) {
        document.getElementById('total-filmes').textContent = '0';
        document.getElementById('ano-medio').textContent = '0';
        document.getElementById('avaliacao-media').textContent = '0.0';
        document.getElementById('genero-comum').textContent = '-';
        return;
    }

    const total = filmes.length;
    const generos = {};
    let somaAnos = 0;
    let somaAvaliacoes = 0;
    let countAvaliacoes = 0;

    filmes.forEach(filme => {
        generos[filme.genero] = (generos[filme.genero] || 0) + 1;
        somaAnos += filme.anolancemento;
        if (filme.avaliacao && filme.avaliacao > 0) {
            somaAvaliacoes += filme.avaliacao;
            countAvaliacoes++;
        }
    });

    document.getElementById('total-filmes').textContent = total;
    document.getElementById('ano-medio').textContent = Math.round(somaAnos / total);

    const avaliacaoMedia = countAvaliacoes > 0 ? (somaAvaliacoes / countAvaliacoes).toFixed(1) : '0.0';
    document.getElementById('avaliacao-media').textContent = avaliacaoMedia;

    const generoComum = Object.entries(generos)
        .sort((a, b) => b[1] - a[1])[0];
    document.getElementById('genero-comum').textContent = generoComum ? generoComum[0] : '-';
}

// Exportar/Importar
function exportarFilmes() {
    const dataStr = JSON.stringify(filmes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `catalogo-filmes-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Catálogo exportado com sucesso! 📥', 'success');
}

async function importarFilmes(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            if (!Array.isArray(imported)) {
                showToast('Formato de arquivo inválido', 'error');
                return;
            }

            let sucessos = 0;
            let erros = 0;

            for (const filme of imported) {
                try {
                    await fazerRequisicao(`${API_BASE_URL}/filmes`, {
                        method: 'POST',
                        body: JSON.stringify(filme)
                    });
                    sucessos++;
                } catch (error) {
                    erros++;
                }
            }

            showToast(`Importação concluída: ${sucessos} sucessos, ${erros} erros`, 'success');
            carregarFilmes();
        } catch (error) {
            showToast('Erro ao ler arquivo', 'error');
        }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
}

// Loading
function showLoading(show) {
    if (loading) {
        loading.style.display = show ? 'block' : 'none';
    }
    if (show) {
        if (filmesContainer) filmesContainer.style.display = 'none';
        if (emptyState) emptyState.style.display = 'none';
    }
}

// Toast
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Gerar placeholder SVG (não depende de serviços externos)
function gerarPlaceholderSVG(nome, largura = 300, altura = 450) {
    const texto = nome.substring(0, 20).replace(/[<>]/g, ''); // Limitar e remover caracteres problemáticos
    const svg = `<svg width="${largura}" height="${altura}" xmlns="http://www.w3.org/2000/svg">
<rect width="100%" height="100%" fill="#6366f1"/>
<text x="50%" y="50%" font-family="Arial, sans-serif" font-size="18" fill="#ffffff" text-anchor="middle" dominant-baseline="middle" font-weight="bold">${texto}</text>
</svg>`;
    try {
        return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    } catch (e) {
        // Fallback simples
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNjM2NmYxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZm9udC13ZWlnaHQ9ImJvbGQiPkZJTElNRTwvdGV4dD48L3N2Zz4=';
    }
}

// Escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Ver detalhes do filme
function verDetalhes(id) {
    const filme = filmes.find(f => f._id === id);
    if (!filme) {
        showToast('Filme não encontrado', 'error');
        return;
    }

    const modal = document.getElementById('detalhes-modal');
    const content = document.getElementById('detalhes-content');

    const posterUrl = (filme.poster && filme.poster.trim()) ? filme.poster : gerarPlaceholderSVG(filme.nome, 400, 600);
    const placeholderUrl = gerarPlaceholderSVG(filme.nome, 400, 600);
    const avaliacao = filme.avaliacao ? filme.avaliacao.toFixed(1) : 'Não avaliado';
    const duracao = filme.duracao ? `${filme.duracao} minutos` : 'Não informado';
    const diretor = filme.diretor || 'Não informado';
    const sinopse = filme.sinopse || 'Sinopse não disponível.';
    const genero = filme.genero || 'Não informado';
    const ano = filme.anolancemento || 'Não informado';

    // Criar estrelas para avaliação
    const estrelas = filme.avaliacao ? gerarEstrelas(filme.avaliacao) : '';

    content.innerHTML = `
        <div class="detalhes-container">
            <div class="detalhes-poster">
                <img src="${escapeHtml(posterUrl)}" alt="${escapeHtml(filme.nome)}" class="detalhes-poster-img" onerror="this.src='${placeholderUrl}'">
            </div>
            <div class="detalhes-info">
                <h2 class="detalhes-titulo">${escapeHtml(filme.nome)}</h2>

                <div class="detalhes-meta">
                    <div class="detalhes-item">
                        <span class="detalhes-label">📅 Ano:</span>
                        <span class="detalhes-value">${ano}</span>
                    </div>
                    <div class="detalhes-item">
                        <span class="detalhes-label">🎭 Gênero:</span>
                        <span class="detalhes-value">${escapeHtml(genero)}</span>
                    </div>
                    <div class="detalhes-item">
                        <span class="detalhes-label">🎬 Diretor:</span>
                        <span class="detalhes-value">${escapeHtml(diretor)}</span>
                    </div>
                    <div class="detalhes-item">
                        <span class="detalhes-label">⏱️ Duração:</span>
                        <span class="detalhes-value">${duracao}</span>
                    </div>
                    <div class="detalhes-item">
                        <span class="detalhes-label">⭐ Avaliação:</span>
                        <span class="detalhes-value">
                            ${estrelas}
                            <span class="detalhes-avaliacao-num">${avaliacao}/10</span>
                        </span>
                    </div>
                </div>

                <div class="detalhes-sinopse">
                    <h3 class="detalhes-sinopse-titulo">📖 Sinopse</h3>
                    <p class="detalhes-sinopse-texto">${escapeHtml(sinopse)}</p>
                </div>

                <div class="detalhes-actions">
                    <button class="btn btn-primary" onclick="editarFilme('${filme._id}'); fecharDetalhes();">
                        ✏️ Editar Filme
                    </button>
                    <button class="btn btn-secondary" onclick="fecharDetalhes()">
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    `;

    modal.classList.add('show');

    // Configurar ID do filme para comentários
    currentFilmeIdForComments = filme._id;
    document.getElementById('comentario-filme-id').value = filme._id;
    
    // Carregar comentários do filme
    carregarComentarios(filme._id);

    // Fechar modal
    document.querySelector('.close-detalhes').onclick = fecharDetalhes;
    modal.onclick = (e) => {
        if (e.target === modal) fecharDetalhes();
    };

    // Fechar com ESC
    document.addEventListener('keydown', function fecharComEsc(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            fecharDetalhes();
            document.removeEventListener('keydown', fecharComEsc);
        }
    });
}

function fecharDetalhes() {
    const modal = document.getElementById('detalhes-modal');
    modal.classList.remove('show');
}

function gerarEstrelas(avaliacao) {
    const estrelasCheias = Math.floor(avaliacao);
    const temMeiaEstrela = avaliacao % 1 >= 0.5;
    const estrelasVazias = 10 - estrelasCheias - (temMeiaEstrela ? 1 : 0);

    let html = '';
    for (let i = 0; i < estrelasCheias; i++) {
        html += '<span class="estrela estrela-cheia">⭐</span>';
    }
    if (temMeiaEstrela) {
        html += '<span class="estrela estrela-meia">⭐</span>';
    }
    for (let i = 0; i < estrelasVazias; i++) {
        html += '<span class="estrela estrela-vazia">☆</span>';
    }
    return html;
}

// ========================================
// Comentários - Funções
// ========================================

let currentFilmeIdForComments = null;

// Carregar comentários de um filme
async function carregarComentarios(filmeId) {
    const listaContainer = document.getElementById('comentarios-lista');
    const countBadge = document.getElementById('comentarios-count');
    
    if (!listaContainer) return;
    
    // Mostrar loading
    listaContainer.innerHTML = `
        <div class="comentarios-loading">
            <div class="spinner"></div>
            <p>Carregando comentários...</p>
        </div>
    `;
    
    try {
        const result = await fazerRequisicao(`${API_BASE_URL}/comentarios/filme/${filmeId}`);
        
        if (result.success) {
            const comentarios = result.data || [];
            countBadge.textContent = comentarios.length;
            
            if (comentarios.length === 0) {
                listaContainer.innerHTML = `
                    <div class="comentarios-empty">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        <p>Nenhum comentário ainda. Seja o primeiro a comentar!</p>
                    </div>
                `;
            } else {
                listaContainer.innerHTML = comentarios.map(comentario => renderizarComentario(comentario)).join('');
            }
        } else {
            listaContainer.innerHTML = `
                <div class="comentarios-empty">
                    <p>Erro ao carregar comentários</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Erro ao carregar comentários:', error);
        listaContainer.innerHTML = `
            <div class="comentarios-empty">
                <p>Erro ao conectar com o servidor</p>
            </div>
        `;
    }
}

// Renderizar um comentário
function renderizarComentario(comentario) {
    const data = new Date(comentario.dataCriacao);
    const dataFormatada = data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const avaliacaoHtml = comentario.avaliacao > 0 
        ? `<span class="comentario-rating">⭐ ${comentario.avaliacao.toFixed(1)}</span>`
        : '';
    
    return `
        <div class="comentario-item" data-id="${comentario._id}">
            <div class="comentario-header">
                <div class="comentario-autor-info">
                    <span class="comentario-autor">${escapeHtml(comentario.autor)}</span>
                    <span class="comentario-data">${dataFormatada}</span>
                </div>
                ${avaliacaoHtml}
            </div>
            <p class="comentario-texto">${escapeHtml(comentario.texto)}</p>
            <div class="comentario-actions">
                <button class="btn btn-ghost" onclick="deletarComentario('${comentario._id}')" title="Excluir">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    Excluir
                </button>
            </div>
        </div>
    `;
}

// Enviar novo comentário
async function enviarComentario(e) {
    e.preventDefault();
    
    const filmeId = document.getElementById('comentario-filme-id').value;
    const autor = document.getElementById('comentario-autor').value.trim();
    const texto = document.getElementById('comentario-texto').value.trim();
    const avaliacao = document.getElementById('comentario-avaliacao').value;
    
    if (!autor || !texto) {
        showToast('Preencha seu nome e comentário', 'error');
        return;
    }
    
    const comentarioData = {
        filmeId: filmeId,
        autor: autor,
        texto: texto,
        avaliacao: avaliacao ? parseFloat(avaliacao) : 0
    };
    
    try {
        const result = await fazerRequisicao(`${API_BASE_URL}/comentarios`, {
            method: 'POST',
            body: JSON.stringify(comentarioData)
        });
        
        if (result.success) {
            showToast('Comentário enviado com sucesso! 💬', 'success');
            
            // Limpar formulário
            document.getElementById('comentario-autor').value = '';
            document.getElementById('comentario-texto').value = '';
            document.getElementById('comentario-avaliacao').value = '';
            document.getElementById('comentario-chars').textContent = '0/1000';
            
            // Recarregar comentários
            carregarComentarios(filmeId);
        } else {
            showToast(result.message || 'Erro ao enviar comentário', 'error');
        }
    } catch (error) {
        console.error('Erro ao enviar comentário:', error);
        showToast('Erro ao conectar com o servidor', 'error');
    }
}

// Deletar comentário
async function deletarComentario(comentarioId) {
    if (!confirm('Tem certeza que deseja excluir este comentário?')) {
        return;
    }
    
    try {
        const result = await fazerRequisicao(`${API_BASE_URL}/comentarios/${comentarioId}`, {
            method: 'DELETE'
        });
        
        if (result.success) {
            showToast('Comentário excluído! 🗑️', 'success');
            
            // Recarregar comentários
            if (currentFilmeIdForComments) {
                carregarComentarios(currentFilmeIdForComments);
            }
        } else {
            showToast(result.message || 'Erro ao excluir comentário', 'error');
        }
    } catch (error) {
        console.error('Erro ao excluir comentário:', error);
        showToast('Erro ao conectar com o servidor', 'error');
    }
}

// Contador de caracteres do comentário
function setupComentarioCharCounter() {
    const textarea = document.getElementById('comentario-texto');
    const counter = document.getElementById('comentario-chars');
    
    if (textarea && counter) {
        textarea.addEventListener('input', () => {
            const length = textarea.value.length;
            counter.textContent = `${length}/1000`;
            
            if (length > 900) {
                counter.style.color = 'var(--warning)';
            } else if (length >= 1000) {
                counter.style.color = 'var(--danger)';
            } else {
                counter.style.color = 'var(--text-muted)';
            }
        });
    }
}

// Setup do formulário de comentários
function setupComentarioForm() {
    const form = document.getElementById('comentario-form');
    if (form) {
        form.addEventListener('submit', enviarComentario);
    }
    setupComentarioCharCounter();
}

// Inicializar comentários quando modal de detalhes abrir
document.addEventListener('DOMContentLoaded', () => {
    setupComentarioForm();
});

// Expor funções globalmente
window.editarFilme = editarFilme;
window.confirmarDeletar = confirmarDeletar;
window.verDetalhes = verDetalhes;
window.abrirModal = abrirModal;
window.fecharFormModal = fecharFormModal;
window.fecharDetalhes = fecharDetalhes;
window.deletarComentario = deletarComentario;
