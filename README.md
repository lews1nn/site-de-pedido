# Sistema de Pedidos Online

Um sistema completo de pedidos online estilo restaurante, onde os clientes podem fazer pedidos e você recebe as notificações em tempo real.

## 🚀 Funcionalidades

- **Catálogo de Produtos**: Interface moderna para exibir produtos
- **Carrinho de Compras**: Adicionar, remover e ajustar quantidades
- **Sistema de Pedidos**: Formulário completo com dados do cliente
- **Painel Administrativo**: Visualizar e gerenciar todos os pedidos
- **Notificações**: Pedidos aparecem no console do servidor
- **Status de Pedidos**: Acompanhar pedidos (Novo, Processando, Concluído)

## 📋 Pré-requisitos

- Python 3.7 ou superior
- pip (gerenciador de pacotes Python)

## 🔧 Instalação

1. **Instale as dependências:**
```bash
pip install -r requirements.txt
```

## 🎯 Como Usar

1. **Inicie o servidor:**
```bash
python app.py
```

2. **Acesse o site:**
   - Cliente: https://lews1nn.github.io/site-de-pedido/

3. **Faça um pedido:**
   - Adicione produtos ao carrinho
   - Clique no ícone do carrinho
   - Preencha os dados e finalize o pedido

4. **Veja os pedidos:**
   - Acesse a página de administração
   - Todos os pedidos aparecerão lá
   - Você também verá os pedidos no console do terminal

## 📁 Estrutura do Projeto

```
sistema-pedidos/
├── app.py                 # Servidor Flask (backend)
├── requirements.txt       # Dependências Python
├── pedidos.json          # Arquivo de armazenamento (criado automaticamente)
├── templates/
│   ├── index.html        # Página principal (cliente)
│   └── admin.html        # Painel administrativo
└── static/
    ├── style.css         # Estilos da página cliente
    ├── admin.css         # Estilos do painel admin
    ├── script.js         # JavaScript da página cliente
    └── admin.js          # JavaScript do painel admin
```

## 🎨 Personalização

### Adicionar/Modificar Produtos

Edite o array `produtos` no arquivo `static/script.js`:

```javascript
const produtos = [
    {
        id: 1,
        nome: "Seu Produto",
        descricao: "Descrição do produto",
        preco: 29.90,
        icone: "🍔"
    },
    // ... mais produtos
];
```

### Modificar Cores e Estilos

Edite os arquivos CSS:
- `static/style.css` - Estilos do site cliente
- `static/admin.css` - Estilos do painel admin

As cores principais estão definidas nas variáveis CSS no início de cada arquivo.

## 🔐 Segurança

Este é um projeto educacional. Para uso em produção, considere:
- Autenticação de usuários
- Validação de dados no servidor
- Proteção contra SQL Injection (se usar banco de dados)
- HTTPS para transmissão segura
- Rate limiting para prevenir spam

## 📝 Próximos Passos

Algumas melhorias que você pode implementar:
- Banco de dados (SQLite, PostgreSQL, etc.)
- Sistema de autenticação
- Notificações por email
- Integração com pagamento
- Histórico de pedidos por cliente
- Relatórios e estatísticas

## 🐛 Solução de Problemas

**Erro ao iniciar o servidor:**
- Verifique se a porta 5000 está livre
- Certifique-se de ter instalado todas as dependências

**Pedidos não aparecem:**
- Verifique o console do terminal
- Confira se o arquivo `pedidos.json` está sendo criado

## 📚 Aprendizado

Este projeto ensina:
- Backend com Flask (Python)
- Frontend com HTML, CSS e JavaScript
- APIs REST
- Armazenamento de dados em JSON
- Interface responsiva
- Gerenciamento de estado no frontend

## 📄 Licença

Este projeto é livre para uso educacional.

---

Desenvolvido para aprendizado! 🎓

