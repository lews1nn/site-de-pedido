// Produtos do catálogo - Itens de Basquete
const produtos = [
    {
        id: 1,
        nome: "Tênis Nike Air Jordan",
        descricao: "Tênis de basquete com tecnologia Air Max, tamanhos 38-45",
        preco: 899.90,
        icone: "👟",
        categoria: "tênis",
        destaque: true
    },
    {
        id: 2,
        nome: "Tênis Adidas Pro Model",
        descricao: "Tênis profissional para quadra, alta performance, tamanhos 36-44",
        preco: 649.90,
        icone: "👟",
        categoria: "tênis"
    },
    {
        id: 3,
        nome: "Tênis Puma Court Rider",
        descricao: "Design moderno, conforto máximo, ideal para treinos, tamanhos 37-43",
        preco: 459.90,
        icone: "👟",
        categoria: "tênis"
    },
    {
        id: 4,
        nome: "Bola de Basquete Spalding",
        descricao: "Bola oficial NBA, couro sintético, tamanho 7 (masculino)",
        preco: 189.90,
        icone: "🏀",
        categoria: "bolas",
        destaque: true
    },
    {
        id: 5,
        nome: "Bola de Basquete Wilson",
        descricao: "Bola profissional, alta qualidade, tamanho 6 (feminino)",
        preco: 159.90,
        icone: "🏀",
        categoria: "bolas"
    },
    {
        id: 6,
        nome: "Bola de Basquete Molten",
        descricao: "Bola oficial FIBA, tecnologia avançada, tamanho 7",
        preco: 219.90,
        icone: "🏀",
        categoria: "bolas"
    },
    {
        id: 7,
        nome: "Camiseta NBA Lakers",
        descricao: "Camiseta oficial, 100% algodão, tamanhos P/M/G/GG",
        preco: 249.90,
        icone: "👕",
        categoria: "camisetas",
        destaque: true
    },
    {
        id: 8,
        nome: "Camiseta NBA Warriors",
        descricao: "Camiseta oficial, tecido tecnológico, tamanhos P/M/G/GG",
        preco: 249.90,
        icone: "👕",
        categoria: "camisetas"
    },
    {
        id: 9,
        nome: "Camiseta NBA Bulls",
        descricao: "Camiseta clássica, design retrô, tamanhos P/M/G/GG",
        preco: 229.90,
        icone: "👕",
        categoria: "camisetas"
    },
    {
        id: 10,
        nome: "Camiseta NBA Celtics",
        descricao: "Camiseta oficial, conforto premium, tamanhos P/M/G/GG",
        preco: 249.90,
        icone: "👕",
        categoria: "camisetas"
    },
    {
        id: 11,
        nome: "Tênis Under Armour Curry",
        descricao: "Assinatura Stephen Curry, tecnologia Flow, tamanhos 38-44",
        preco: 799.90,
        icone: "👟",
        categoria: "tênis",
        destaque: true
    },
    {
        id: 12,
        nome: "Bola de Basquete Nike",
        descricao: "Bola premium, design exclusivo, tamanho 7",
        preco: 199.90,
        icone: "🏀",
        categoria: "bolas"
    }
];

// Carrinho de compras
let carrinho = [];

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    renderizarProdutos();
    atualizarCarrinho();
});

// Renderizar produtos na página
function renderizarProdutos() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = produtos.map(produto => `
        <div class="product-card ${produto.destaque ? 'destaque' : ''}">
            ${produto.destaque ? '<span class="badge-destaque"><i class="fas fa-star"></i> Destaque</span>' : ''}
            <div class="product-image ${produto.categoria}">
                <div class="product-icon">${produto.icone}</div>
            </div>
            <div class="product-info">
                <h3>${produto.nome}</h3>
                <p class="product-description">${produto.descricao}</p>
                <span class="product-category">${produto.categoria.charAt(0).toUpperCase() + produto.categoria.slice(1)}</span>
            </div>
            <div class="product-footer">
                <span class="product-price">R$ ${produto.preco.toFixed(2)}</span>
                <button class="btn-add" onclick="adicionarAoCarrinho(${produto.id})">
                    <i class="fas fa-shopping-cart"></i> Adicionar
                </button>
            </div>
        </div>
    `).join('');
}

// Adicionar produto ao carrinho
function adicionarAoCarrinho(produtoId) {
    const produto = produtos.find(p => p.id === produtoId);
    const itemExistente = carrinho.find(item => item.id === produtoId);

    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({
            ...produto,
            quantidade: 1
        });
    }

    atualizarCarrinho();
    mostrarNotificacao(`${produto.nome} adicionado ao carrinho!`);
}

// Remover item do carrinho
function removerDoCarrinho(produtoId) {
    carrinho = carrinho.filter(item => item.id !== produtoId);
    atualizarCarrinho();
}

// Atualizar quantidade
function atualizarQuantidade(produtoId, delta) {
    const item = carrinho.find(item => item.id === produtoId);
    if (item) {
        item.quantidade += delta;
        if (item.quantidade <= 0) {
            removerDoCarrinho(produtoId);
        } else {
            atualizarCarrinho();
        }
    }
}

// Atualizar interface do carrinho
function atualizarCarrinho() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const btnCheckout = document.querySelector('.btn-checkout');

    // Atualizar contador
    const totalItens = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
    cartCount.textContent = totalItens;

    // Atualizar lista de itens
    if (carrinho.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
        btnCheckout.disabled = true;
    } else {
        cartItems.innerHTML = carrinho.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.nome}</div>
                    <div class="cart-item-price">R$ ${item.preco.toFixed(2)} cada</div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="atualizarQuantidade(${item.id}, -1)">-</button>
                        <span class="quantity">${item.quantidade}</span>
                        <button class="quantity-btn" onclick="atualizarQuantidade(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-item" onclick="removerDoCarrinho(${item.id})" title="Remover">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        btnCheckout.disabled = false;
    }

    // Atualizar total
    const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    cartTotal.textContent = total.toFixed(2);
}

// Toggle carrinho
function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    sidebar.classList.toggle('open');
}

// Abrir modal de checkout
function openCheckout() {
    const modal = document.getElementById('checkoutModal');
    const summary = document.getElementById('orderSummary');
    const total = document.getElementById('orderTotal');

    // Atualizar resumo do pedido
    summary.innerHTML = carrinho.map(item => `
        <div class="order-summary-item">
            <span>${item.nome} x${item.quantidade}</span>
            <span>R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
        </div>
    `).join('');

    const totalValue = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    total.textContent = totalValue.toFixed(2);

    modal.classList.add('show');
}

// Fechar modal de checkout
function closeCheckout() {
    const modal = document.getElementById('checkoutModal');
    modal.classList.remove('show');
}

// Submeter pedido
async function submitOrder(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const dados = {
        cliente: formData.get('cliente'),
        telefone: formData.get('telefone'),
        endereco: formData.get('endereco'),
        observacoes: formData.get('observacoes'),
        itens: carrinho.map(item => ({
            nome: item.nome,
            quantidade: item.quantidade,
            preco: item.preco,
            subtotal: item.preco * item.quantidade
        })),
        total: carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0)
    };

    try {
        const response = await fetch('/api/pedidos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        const result = await response.json();

        if (result.success) {
            // Mostrar modal de sucesso
            document.getElementById('successOrderId').textContent = result.pedido_id;
            document.getElementById('checkoutModal').classList.remove('show');
            document.getElementById('successModal').classList.add('show');

            // Limpar carrinho
            carrinho = [];
            atualizarCarrinho();
            toggleCart();

            // Limpar formulário
            event.target.reset();
        } else {
            alert('Erro ao enviar pedido: ' + result.error);
        }
    } catch (error) {
        // Se o servidor não estiver disponível (modo demonstração)
        // Simular sucesso para demonstração
        const pedidoIdSimulado = Math.floor(Math.random() * 10000) + 1;
        document.getElementById('successOrderId').textContent = pedidoIdSimulado;
        document.getElementById('checkoutModal').classList.remove('show');
        document.getElementById('successModal').classList.add('show');

        // Limpar carrinho
        carrinho = [];
        atualizarCarrinho();
        toggleCart();

        // Limpar formulário
        event.target.reset();
        
        console.log('Modo demonstração: Pedido não foi salvo (servidor não disponível)');
        console.log('Dados do pedido:', dados);
    }
}

// Fechar modal de sucesso
function closeSuccessModal() {
    document.getElementById('successModal').classList.remove('show');
}

// Notificação simples
function mostrarNotificacao(mensagem) {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 3000;
        animation: slideIn 0.3s;
    `;
    notification.textContent = mensagem;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Fechar modais ao clicar fora
document.getElementById('checkoutModal').addEventListener('click', (e) => {
    if (e.target.id === 'checkoutModal') {
        closeCheckout();
    }
});

document.getElementById('successModal').addEventListener('click', (e) => {
    if (e.target.id === 'successModal') {
        closeSuccessModal();
    }
});


