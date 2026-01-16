# 📚 Explicação Completa do Código - Sistema de Pedidos Online

Este documento explica **cada linha de código** de todos os arquivos do sistema, para que você entenda completamente como tudo funciona.

---

## 📄 1. app.py - Backend (Servidor Flask)

Este é o arquivo principal do servidor. Ele recebe pedidos, salva em arquivo JSON e fornece as páginas HTML.

### Linhas 1-4: Importações
```python
from flask import Flask, render_template, request, jsonify
from datetime import datetime
import json
import os
```
- **Linha 1**: Importa Flask (framework web), `render_template` (renderiza HTML), `request` (recebe dados), `jsonify` (retorna JSON)
- **Linha 2**: Importa `datetime` para trabalhar com datas/horas
- **Linha 3**: Importa `json` para trabalhar com arquivos JSON
- **Linha 4**: Importa `os` para verificar se arquivos existem

### Linha 6: Criar aplicação Flask
```python
app = Flask(__name__)
```
- Cria a aplicação Flask. `__name__` é o nome do módulo atual (app.py)

### Linhas 8-9: Configuração do arquivo de pedidos
```python
PEDIDOS_FILE = 'pedidos.json'
```
- Define o nome do arquivo onde os pedidos serão salvos

### Linhas 11-14: Inicializar arquivo se não existir
```python
if not os.path.exists(PEDIDOS_FILE):
    with open(PEDIDOS_FILE, 'w', encoding='utf-8') as f:
        json.dump([], f)
```
- **Linha 12**: Verifica se o arquivo `pedidos.json` existe
- **Linha 13**: Se não existir, cria o arquivo em modo escrita ('w') com encoding UTF-8
- **Linha 14**: Salva um array vazio `[]` no arquivo (JSON vazio)

### Linhas 16-22: Função para carregar pedidos
```python
def carregar_pedidos():
    """Carrega todos os pedidos do arquivo"""
    try:
        with open(PEDIDOS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except:
        return []
```
- **Linha 16**: Define função que carrega pedidos
- **Linha 19**: Abre o arquivo em modo leitura ('r')
- **Linha 20**: `json.load(f)` converte o JSON do arquivo em lista Python
- **Linha 21**: Se der erro (arquivo não existe, corrompido), retorna lista vazia

### Linhas 24-29: Função para salvar pedido
```python
def salvar_pedido(pedido):
    """Salva um novo pedido no arquivo"""
    pedidos = carregar_pedidos()
    pedidos.append(pedido)
    with open(PEDIDOS_FILE, 'w', encoding='utf-8') as f:
        json.dump(pedidos, f, ensure_ascii=False, indent=2)
```
- **Linha 24**: Define função que salva um pedido
- **Linha 26**: Carrega todos os pedidos existentes
- **Linha 27**: Adiciona o novo pedido à lista
- **Linha 28**: Abre arquivo em modo escrita ('w')
- **Linha 29**: Salva a lista completa no arquivo. `ensure_ascii=False` permite acentos, `indent=2` formata bonito

### Linhas 31-34: Rota da página principal
```python
@app.route('/')
def index():
    """Página principal - catálogo de produtos"""
    return render_template('index.html')
```
- **Linha 31**: `@app.route('/')` define que quando acessar `http://localhost:5000/`, executa esta função
- **Linha 34**: Retorna o HTML da página principal (index.html)

### Linhas 36-39: Rota do painel admin
```python
@app.route('/admin')
def admin():
    """Página de administração - ver pedidos"""
    return render_template('admin.html')
```
- Quando acessar `/admin`, mostra a página de administração

### Linhas 41-83: Endpoint para criar pedido (API)
```python
@app.route('/api/pedidos', methods=['POST'])
def criar_pedido():
```
- **Linha 41**: Define rota `/api/pedidos` que aceita apenas requisições POST
- **Linha 45**: `request.json` pega os dados JSON enviados pelo cliente
- **Linhas 48-58**: Cria objeto do pedido com:
  - `id`: número sequencial (quantidade de pedidos + 1)
  - `cliente`, `telefone`, `endereco`: dados do formulário
  - `itens`: lista de produtos
  - `total`: valor total
  - `status`: sempre começa como 'Novo'
  - `data`: data/hora atual formatada
- **Linha 61**: Salva o pedido no arquivo
- **Linhas 64-78**: Imprime no console do terminal (para você ver)
- **Linha 80**: Retorna JSON com `success: True` e o ID do pedido
- **Linhas 82-83**: Se der erro, retorna erro 400

### Linhas 85-91: Endpoint para listar pedidos
```python
@app.route('/api/pedidos', methods=['GET'])
def listar_pedidos():
    pedidos = carregar_pedidos()
    pedidos.reverse()
    return jsonify(pedidos)
```
- **Linha 85**: Aceita requisições GET (buscar dados)
- **Linha 88**: Carrega todos os pedidos
- **Linha 90**: Inverte a ordem (mais recentes primeiro)
- **Linha 91**: Retorna JSON com todos os pedidos

### Linhas 93-111: Endpoint para atualizar status
```python
@app.route('/api/pedidos/<int:pedido_id>/status', methods=['PUT'])
```
- **Linha 93**: Rota dinâmica: `<int:pedido_id>` pega o ID do pedido da URL
- **Linha 98**: Pega o novo status do JSON enviado
- **Linhas 100-106**: Procura o pedido pelo ID e atualiza o status
- **Linha 108**: Se não encontrar, retorna erro 404

### Linhas 113-121: Iniciar servidor
```python
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
```
- **Linha 113**: Só executa se o arquivo for rodado diretamente (não importado)
- **Linha 121**: Inicia o servidor:
  - `debug=True`: recarrega automaticamente quando você salva código
  - `host='0.0.0.0'`: aceita conexões de qualquer IP
  - `port=5000`: roda na porta 5000

---

## 📄 2. templates/index.html - Página Principal (HTML)

Este é o HTML da página onde os clientes fazem pedidos.

### Linhas 1-2: Declaração HTML
```html
<!DOCTYPE html>
<html lang="pt-BR">
```
- **Linha 1**: Declara que é documento HTML5
- **Linha 2**: Tag raiz do HTML, idioma português brasileiro

### Linhas 3-10: Cabeçalho (head)
```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BasketStore - Equipamentos de Basquete</title>
    <link rel="stylesheet" href="{{ url_for('static', filename='style.css') }}">
```
- **Linha 4**: Define encoding UTF-8 (suporta acentos)
- **Linha 5**: Viewport responsivo (ajusta em celular)
- **Linha 6**: Título que aparece na aba do navegador
- **Linha 7**: `{{ url_for(...) }}` é sintaxe Flask que gera o caminho correto para o CSS
- **Linha 8**: Importa fonte Google Fonts (Inter)
- **Linha 9**: Importa Font Awesome (ícones)

### Linhas 12-26: Barra de navegação
```html
<nav class="navbar">
    <div class="nav-container">
        <div class="nav-logo">
            <i class="fas fa-basketball-ball"></i> BasketStore
        </div>
```
- **Linha 12**: Tag `<nav>` para navegação
- **Linha 15**: Ícone de basquete do Font Awesome
- **Linha 21**: `onclick="toggleCart()"` chama função JavaScript ao clicar
- **Linha 23**: `<span id="cartCount">` será atualizado pelo JavaScript com quantidade de itens

### Linhas 28-52: Seção Hero (banner principal)
```html
<header class="hero">
    <div class="hero-background"></div>
    <div class="hero-content">
```
- **Linha 28**: Seção de destaque no topo da página
- **Linha 29**: Div para efeitos de fundo (gradiente animado)
- **Linhas 31-33**: Badge circular com ícone de basquete rotacionando
- **Linhas 37-49**: Cards com estatísticas (Entrega Rápida, etc.)

### Linhas 54-64: Seção de produtos
```html
<main class="container">
    <section class="menu-section" id="produtos">
        <div class="products-grid" id="productsGrid">
```
- **Linha 60**: `id="productsGrid"` - JavaScript vai inserir os produtos aqui
- **Linha 61**: Comentário HTML (não aparece na página)

### Linhas 66-85: Carrinho lateral
```html
<div class="cart-sidebar" id="cartSidebar">
```
- **Linha 67**: Carrinho que desliza da direita
- **Linha 70**: Botão X para fechar (`onclick="toggleCart()"`)
- **Linha 74**: `id="cartItems"` - JavaScript insere itens aqui
- **Linha 79**: `id="cartTotal"` - mostra total do pedido
- **Linha 81**: Botão desabilitado quando carrinho vazio (`disabled`)

### Linhas 87-125: Modal de checkout
```html
<div class="modal" id="checkoutModal">
    <form id="checkoutForm" onsubmit="submitOrder(event)">
```
- **Linha 88**: Modal (janela popup) para finalizar pedido
- **Linha 96**: Formulário que chama `submitOrder()` ao enviar
- **Linhas 98-112**: Campos do formulário:
  - `name="cliente"` - nome do cliente
  - `required` - campo obrigatório
  - `placeholder` - texto de exemplo
- **Linha 115**: `id="orderSummary"` - JavaScript mostra resumo aqui

### Linhas 127-138: Modal de sucesso
```html
<div class="modal" id="successModal">
```
- Aparece após enviar pedido com sucesso
- **Linha 135**: Mostra o ID do pedido recebido

### Linha 140: Script JavaScript
```html
<script src="{{ url_for('static', filename='script.js') }}"></script>
```
- Carrega o arquivo JavaScript que controla toda a interatividade

---

## 📄 3. static/script.js - JavaScript do Cliente

Controla toda a lógica do frontend: produtos, carrinho, pedidos.

### Linhas 1-103: Array de produtos
```javascript
const produtos = [
    {
        id: 1,
        nome: "Tênis Nike Air Jordan",
        descricao: "...",
        preco: 899.90,
        icone: "👟",
        categoria: "tênis",
        destaque: true
    },
```
- **Linha 1**: `const` = constante (não muda)
- Cada objeto representa um produto com suas propriedades
- `destaque: true` = produto em destaque

### Linha 106: Variável do carrinho
```javascript
let carrinho = [];
```
- Array vazio que vai armazenar produtos adicionados

### Linhas 109-112: Inicialização
```javascript
document.addEventListener('DOMContentLoaded', () => {
    renderizarProdutos();
    atualizarCarrinho();
});
```
- **Linha 109**: Espera o HTML carregar completamente
- **Linha 110**: Chama função para mostrar produtos na tela
- **Linha 111**: Atualiza o carrinho (inicia vazio)

### Linhas 115-136: Renderizar produtos
```javascript
function renderizarProdutos() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = produtos.map(produto => `
```
- **Linha 116**: Pega o elemento HTML com id `productsGrid`
- **Linha 117**: `produtos.map()` cria HTML para cada produto
- **Linha 118**: Template string (entre crases ``) permite variáveis `${}`
- **Linha 119**: Se produto tem `destaque`, adiciona classe CSS especial
- **Linha 120**: Badge "Destaque" aparece se `produto.destaque` for true
- **Linha 126**: `charAt(0).toUpperCase()` pega primeira letra e deixa maiúscula
- **Linha 135**: `.join('')` junta todos os HTMLs em uma string

### Linhas 139-154: Adicionar ao carrinho
```javascript
function adicionarAoCarrinho(produtoId) {
    const produto = produtos.find(p => p.id === produtoId);
    const itemExistente = carrinho.find(item => item.id === produtoId);
```
- **Linha 140**: Função recebe ID do produto
- **Linha 141**: `find()` procura produto no array pelo ID
- **Linha 142**: Verifica se produto já está no carrinho
- **Linha 144**: Se já existe, aumenta quantidade
- **Linhas 146-149**: Se não existe, adiciona novo item com quantidade 1
- **Linha 152**: Atualiza interface do carrinho
- **Linha 153**: Mostra notificação "adicionado ao carrinho"

### Linhas 157-160: Remover do carrinho
```javascript
function removerDoCarrinho(produtoId) {
    carrinho = carrinho.filter(item => item.id !== produtoId);
```
- **Linha 158**: `filter()` cria novo array sem o item removido

### Linhas 163-173: Atualizar quantidade
```javascript
function atualizarQuantidade(produtoId, delta) {
    item.quantidade += delta;
```
- **Linha 163**: `delta` pode ser +1 ou -1
- **Linha 166**: Aumenta/diminui quantidade
- **Linha 167**: Se quantidade <= 0, remove item

### Linhas 176-215: Atualizar interface do carrinho
```javascript
function atualizarCarrinho() {
    const cartCount = document.getElementById('cartCount');
```
- **Linha 183**: `reduce()` soma todas as quantidades
- **Linha 187**: Se carrinho vazio, mostra mensagem e desabilita botão
- **Linhas 191-208**: Cria HTML para cada item do carrinho
- **Linha 213**: Calcula total: preço × quantidade de cada item

### Linhas 218-221: Abrir/fechar carrinho
```javascript
function toggleCart() {
    sidebar.classList.toggle('open');
```
- **Linha 220**: `toggle()` adiciona/remove classe 'open' (mostra/esconde)

### Linhas 224-241: Abrir modal de checkout
```javascript
function openCheckout() {
    summary.innerHTML = carrinho.map(item => `
        <div class="order-summary-item">
            <span>${item.nome} x${item.quantidade}</span>
```
- **Linha 230**: Cria resumo do pedido mostrando cada item
- **Linha 237**: Calcula total novamente
- **Linha 240**: Mostra modal adicionando classe 'show'

### Linhas 250-299: Enviar pedido ao servidor
```javascript
async function submitOrder(event) {
    event.preventDefault();
```
- **Linha 250**: `async` = função assíncrona (espera resposta do servidor)
- **Linha 251**: `preventDefault()` impede formulário recarregar página
- **Linha 253**: `FormData` pega dados do formulário
- **Linhas 254-266**: Monta objeto com dados do pedido
- **Linha 259**: `map()` transforma itens do carrinho em formato do servidor
- **Linha 269**: `fetch()` envia requisição POST ao servidor
- **Linha 270**: `method: 'POST'` = enviar dados
- **Linha 272**: Define que está enviando JSON
- **Linha 274**: Converte objeto JavaScript em JSON string
- **Linha 277**: `await` espera resposta do servidor
- **Linha 279**: Se sucesso, mostra modal de sucesso
- **Linha 286**: Limpa carrinho
- **Linha 291**: Limpa formulário

### Linhas 307-329: Notificação
```javascript
function mostrarNotificacao(mensagem) {
    const notification = document.createElement('div');
```
- **Linha 309**: Cria elemento `<div>` dinamicamente
- **Linha 310**: `cssText` define vários estilos de uma vez
- **Linha 323**: Adiciona elemento ao body (aparece na tela)
- **Linha 325**: `setTimeout()` espera 3 segundos
- **Linha 327**: Remove elemento após animação

### Linhas 332-342: Fechar modais ao clicar fora
```javascript
document.getElementById('checkoutModal').addEventListener('click', (e) => {
    if (e.target.id === 'checkoutModal') {
```
- **Linha 332**: Adiciona listener de clique no modal
- **Linha 333**: Se clicou no fundo (não no conteúdo), fecha modal

---

## 📄 4. templates/admin.html - Painel Administrativo

HTML da página onde você vê e gerencia pedidos.

### Linhas 31-68: Cards de estatísticas
```html
<div class="stats-grid">
    <div class="stat-card">
        <h3 id="countNovo">0</h3>
```
- **Linha 37**: `id="countNovo"` - JavaScript atualiza com quantidade
- Mostra: Novos, Processando, Concluídos, Total

### Linhas 70-75: Filtros
```html
<button class="filter-btn active" onclick="filtrarPedidos('todos')">
```
- Botões para filtrar pedidos por status
- `active` = botão selecionado

### Linha 77: Lista de pedidos
```html
<div class="orders-list" id="ordersList">
```
- JavaScript insere cards de pedidos aqui

---

## 📄 5. static/admin.js - JavaScript do Admin

Controla o painel administrativo.

### Linhas 1-2: Variáveis globais
```javascript
let todosPedidos = [];
let filtroAtual = 'todos';
```
- Armazena todos os pedidos carregados
- Guarda qual filtro está ativo

### Linhas 5-9: Inicialização
```javascript
document.addEventListener('DOMContentLoaded', () => {
    carregarPedidos();
    setInterval(carregarPedidos, 5000);
});
```
- **Linha 6**: Carrega pedidos ao abrir página
- **Linha 8**: Atualiza a cada 5 segundos automaticamente

### Linhas 12-27: Carregar pedidos do servidor
```javascript
async function carregarPedidos() {
    const response = await fetch('/api/pedidos');
```
- **Linha 14**: `fetch()` faz requisição GET (buscar dados)
- **Linha 15**: Converte resposta JSON em array JavaScript
- **Linha 16**: Atualiza estatísticas
- **Linha 17**: Renderiza pedidos na tela
- **Linhas 19-25**: Se der erro, mostra mensagem

### Linhas 30-40: Atualizar estatísticas
```javascript
const countNovo = todosPedidos.filter(p => p.status === 'Novo').length;
```
- **Linha 31**: `filter()` pega só pedidos com status 'Novo'
- `.length` conta quantos são
- **Linha 36**: Atualiza número na tela

### Linhas 43-53: Filtrar pedidos
```javascript
function filtrarPedidos(status) {
    filtroAtual = status;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
```
- **Linha 44**: Salva filtro escolhido
- **Linha 47**: Remove classe 'active' de todos botões
- **Linha 50**: Adiciona 'active' no botão clicado
- **Linha 52**: Re-renderiza lista com filtro

### Linhas 56-142: Renderizar lista de pedidos
```javascript
function renderizarPedidos() {
    let pedidosFiltrados = todosPedidos;
    if (filtroAtual !== 'todos') {
        pedidosFiltrados = todosPedidos.filter(p => p.status === filtroAtual);
    }
```
- **Linha 60**: Começa com todos os pedidos
- **Linha 62**: Se filtro não é 'todos', filtra por status
- **Linhas 65-72**: Se não há pedidos, mostra mensagem
- **Linha 75**: `map()` cria HTML para cada pedido
- **Linha 85**: Adiciona classe CSS baseada no status (novo, processando, etc.)
- **Linhas 104-110**: Mostra cada item do pedido
- **Linhas 113-117**: Se tem observações, mostra em destaque
- **Linhas 124-138**: Botões de ação aparecem conforme status:
  - Se 'Novo' → botão "Processar"
  - Se 'Processando' → botão "Concluir"
  - Se não 'Concluído' → botão "Cancelar"

### Linhas 145-176: Atualizar status do pedido
```javascript
async function atualizarStatus(pedidoId, novoStatus) {
    if (!confirm(`Deseja realmente...`)) {
        return;
    }
```
- **Linha 146**: `confirm()` mostra popup de confirmação
- **Linha 151**: `fetch()` envia requisição PUT (atualizar)
- **Linha 156**: Envia novo status em JSON
- **Linha 163**: Atualiza status localmente (sem recarregar)
- **Linha 167**: Atualiza estatísticas e re-renderiza

---

## 📄 6. static/style.css - Estilos da Página Cliente

Define como a página principal aparece visualmente.

### Linhas 1-5: Reset CSS
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
```
- **Linha 1**: `*` = todos os elementos
- Remove margens/paddings padrão do navegador
- `border-box` = padding não aumenta largura

### Linhas 7-22: Variáveis CSS
```css
:root {
    --primary-color: #ff6b35;
```
- Define cores reutilizáveis
- `--primary-color` = laranja (tema basquete)
- Pode usar: `color: var(--primary-color);`

### Linhas 24-30: Estilo do body
```css
body {
    font-family: 'Inter', sans-serif;
    background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
```
- Define fonte padrão
- Gradiente de fundo (cinza claro)

### Linhas 32-48: Navbar
```css
.navbar {
    background: white;
    position: sticky;
    top: 0;
    z-index: 100;
}
```
- **Linha 34**: `sticky` = fica fixo ao rolar página
- **Linha 36**: `z-index` = fica acima de outros elementos

### Linhas 59-67: Animação do logo
```css
.nav-logo i {
    animation: bounce 2s infinite;
}
@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
}
```
- Ícone "pula" continuamente
- `@keyframes` define animação
- `infinite` = repete para sempre

### Linhas 130-137: Hero section
```css
.hero {
    background: linear-gradient(135deg, var(--basketball-orange) 0%, ...);
    padding: 6rem 2rem;
}
```
- Gradiente laranja → laranja escuro → preto
- `6rem` = espaçamento grande

### Linhas 161-179: Badge rotacionando
```css
.hero-badge {
    animation: rotate 20s linear infinite;
}
@keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
```
- Círculo com ícone gira 360° continuamente
- `20s` = demora 20 segundos para completar

### Linhas 270-275: Grid de produtos
```css
.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
}
```
- **Linha 272**: Layout em grade
- **Linha 273**: Colunas automáticas, mínimo 280px cada
- **Linha 274**: Espaço de 2rem entre cards

### Linhas 277-309: Cards de produtos
```css
.product-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.product-card:hover {
    transform: translateY(-8px) scale(1.02);
}
```
- **Linha 282**: Transição suave de 0.3s
- **Linha 305**: Ao passar mouse, sobe 8px e aumenta 2%
- Efeito de "levitar"

### Linhas 289-303: Barra no topo do card
```css
.product-card::before {
    content: '';
    height: 4px;
    background: linear-gradient(...);
    transform: scaleX(0);
}
.product-card:hover::before {
    transform: scaleX(1);
}
```
- **Linha 289**: `::before` = elemento virtual antes do card
- **Linha 297**: Inicialmente invisível (largura 0)
- **Linha 301**: Ao hover, expande (barra colorida aparece)

### Linhas 333-355: Imagens por categoria
```css
.product-image.tênis {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.product-image.bolas {
    background: linear-gradient(135deg, var(--primary-color) ...);
}
```
- Cada categoria tem cor diferente
- Tênis = roxo, Bolas = laranja, Camisetas = rosa

### Linhas 357-367: Ícone flutuante
```css
.product-icon {
    animation: float 3s ease-in-out infinite;
}
@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
}
```
- Ícone sobe e desce suavemente

### Linhas 412-419: Preço com gradiente
```css
.product-price {
    background: linear-gradient(...);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
```
- Texto do preço tem gradiente de cor
- `background-clip: text` = gradiente só no texto

### Linhas 446-463: Carrinho lateral
```css
.cart-sidebar {
    position: fixed;
    right: -400px;
    transition: right 0.3s;
}
.cart-sidebar.open {
    right: 0;
}
```
- **Linha 449**: Inicialmente fora da tela (direita -400px)
- **Linha 461**: Quando tem classe 'open', aparece (right: 0)
- Desliza suavemente

### Linhas 616-632: Modal
```css
.modal {
    display: none;
    position: fixed;
    background: rgba(0, 0, 0, 0.5);
}
.modal.show {
    display: flex;
}
```
- **Linha 618**: Inicialmente invisível
- **Linha 620**: Fixo na tela (cobre tudo)
- **Linha 624**: Fundo semi-transparente preto
- **Linha 630**: Quando tem classe 'show', aparece

### Linhas 646-655: Animação do modal
```css
@keyframes modalSlideIn {
    from {
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}
```
- Modal aparece deslizando de cima e aumentando

### Linhas 825-864: Responsivo (mobile)
```css
@media (max-width: 768px) {
    .products-grid {
        grid-template-columns: 1fr;
    }
}
```
- **Linha 825**: `@media` = regras só em telas pequenas
- **Linha 831**: Em mobile, 1 coluna só
- Ajusta tamanhos de fonte, espaçamentos

---

## 📄 7. static/admin.css - Estilos do Painel Admin

Estilos específicos da página administrativa.

### Linhas 102-107: Grid de estatísticas
```css
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}
```
- Cards de estatísticas se ajustam automaticamente
- Mínimo 250px cada

### Linhas 130-144: Ícones coloridos
```css
.stat-icon.novo {
    background: var(--primary-color);
}
.stat-icon.processando {
    background: var(--warning-color);
}
```
- Cada status tem cor diferente
- Novo = azul, Processando = amarelo, Concluído = verde

### Linhas 226-246: Badges de status
```css
.order-status.novo {
    background: #dbeafe;
    color: #1e40af;
}
```
- Badge colorido mostra status do pedido
- Cores suaves de fundo com texto escuro

---

## 🔄 Como Tudo Funciona Junto

1. **Cliente acessa site** → Flask serve `index.html`
2. **JavaScript carrega** → Mostra produtos do array
3. **Cliente adiciona ao carrinho** → JavaScript atualiza interface
4. **Cliente finaliza pedido** → JavaScript envia POST para `/api/pedidos`
5. **Flask recebe** → Salva em `pedidos.json`, imprime no console
6. **Admin acessa `/admin`** → JavaScript busca pedidos via GET
7. **Admin atualiza status** → JavaScript envia PUT, atualiza arquivo

---

## 💡 Conceitos Importantes

- **API REST**: GET (ler), POST (criar), PUT (atualizar)
- **JSON**: Formato de dados (como objeto JavaScript)
- **Async/Await**: Espera operações assíncronas (requisições)
- **DOM**: Document Object Model (estrutura HTML manipulável)
- **Event Listeners**: Ouvem cliques, envios de formulário, etc.
- **CSS Variables**: Cores reutilizáveis com `var(--nome)`
- **Flexbox/Grid**: Layouts modernos e responsivos
- **Transitions/Animations**: Efeitos visuais suaves

---

Espero que esta explicação ajude você a entender cada parte do código! 🚀
