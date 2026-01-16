let todosPedidos = [];
let filtroAtual = 'todos';

// Carregar pedidos ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    carregarPedidos();
    // Atualizar a cada 5 segundos
    setInterval(carregarPedidos, 5000);
});

// Carregar pedidos do servidor
async function carregarPedidos() {
    try {
        const response = await fetch('/api/pedidos');
        todosPedidos = await response.json();
        atualizarEstatisticas();
        renderizarPedidos();
    } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        document.getElementById('ordersList').innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Erro ao carregar pedidos. Tente novamente.</p>
            </div>
        `;
    }
}

// Atualizar estatísticas
function atualizarEstatisticas() {
    const countNovo = todosPedidos.filter(p => p.status === 'Novo').length;
    const countProcessando = todosPedidos.filter(p => p.status === 'Processando').length;
    const countConcluido = todosPedidos.filter(p => p.status === 'Concluído').length;
    const countTotal = todosPedidos.length;

    document.getElementById('countNovo').textContent = countNovo;
    document.getElementById('countProcessando').textContent = countProcessando;
    document.getElementById('countConcluido').textContent = countConcluido;
    document.getElementById('countTotal').textContent = countTotal;
}

// Filtrar pedidos
function filtrarPedidos(status) {
    filtroAtual = status;
    
    // Atualizar botões de filtro
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderizarPedidos();
}

// Renderizar lista de pedidos
function renderizarPedidos() {
    const ordersList = document.getElementById('ordersList');
    
    // Filtrar pedidos
    let pedidosFiltrados = todosPedidos;
    if (filtroAtual !== 'todos') {
        pedidosFiltrados = todosPedidos.filter(p => p.status === filtroAtual);
    }
    
    if (pedidosFiltrados.length === 0) {
        ordersList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>Nenhum pedido encontrado</p>
            </div>
        `;
        return;
    }
    
    ordersList.innerHTML = pedidosFiltrados.map(pedido => `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <div class="order-id">Pedido #${pedido.id}</div>
                    <div class="info-item" style="margin-top: 0.5rem;">
                        <i class="fas fa-calendar"></i>
                        <span>${pedido.data}</span>
                    </div>
                </div>
                <span class="order-status ${pedido.status.toLowerCase()}">${pedido.status}</span>
            </div>
            
            <div class="order-info">
                <div class="info-item">
                    <i class="fas fa-user"></i>
                    <span><strong>Cliente:</strong> ${pedido.cliente}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-phone"></i>
                    <span><strong>Telefone:</strong> ${pedido.telefone}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span><strong>Endereço:</strong> ${pedido.endereco}</span>
                </div>
            </div>
            
            <div class="order-items">
                <strong style="display: block; margin-bottom: 0.5rem;">Itens do Pedido:</strong>
                ${pedido.itens.map(item => `
                    <div class="order-item">
                        <span>${item.nome} x${item.quantidade}</span>
                        <span>R$ ${item.subtotal.toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
            
            ${pedido.observacoes ? `
                <div style="background: #fef3c7; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                    <strong>Observações:</strong> ${pedido.observacoes}
                </div>
            ` : ''}
            
            <div class="order-total">
                Total: R$ ${pedido.total.toFixed(2)}
            </div>
            
            <div class="order-actions">
                ${pedido.status === 'Novo' ? `
                    <button class="btn-action btn-processar" onclick="atualizarStatus(${pedido.id}, 'Processando')">
                        <i class="fas fa-spinner"></i> Processar
                    </button>
                ` : ''}
                ${pedido.status === 'Processando' ? `
                    <button class="btn-action btn-concluir" onclick="atualizarStatus(${pedido.id}, 'Concluído')">
                        <i class="fas fa-check"></i> Concluir
                    </button>
                ` : ''}
                ${pedido.status !== 'Concluído' ? `
                    <button class="btn-action btn-cancelar" onclick="atualizarStatus(${pedido.id}, 'Cancelado')">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Atualizar status do pedido
async function atualizarStatus(pedidoId, novoStatus) {
    if (!confirm(`Deseja realmente alterar o status deste pedido para "${novoStatus}"?`)) {
        return;
    }
    
    try {
        const response = await fetch(`/api/pedidos/${pedidoId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: novoStatus })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Atualizar localmente
            const pedido = todosPedidos.find(p => p.id === pedidoId);
            if (pedido) {
                pedido.status = novoStatus;
            }
            atualizarEstatisticas();
            renderizarPedidos();
        } else {
            alert('Erro ao atualizar status: ' + result.error);
        }
    } catch (error) {
        alert('Erro ao atualizar status. Tente novamente.');
        console.error(error);
    }
}
