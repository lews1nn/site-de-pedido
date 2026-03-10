from flask import Flask, render_template, request, jsonify
from datetime import datetime
import json
import os

app = Flask(__name__)

PEDIDOS_FILE = 'pedidos.json'

if not os.path.exists(PEDIDOS_FILE):
    with open(PEDIDOS_FILE, 'w', encoding='utf-8') as f:
        json.dump([], f)

def carregar_pedidos():
    """Carrega todos os pedidos do arquivo"""
    try:
        with open(PEDIDOS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except:
        return []

def salvar_pedido(pedido):
    """Salva um novo pedido no arquivo"""
    pedidos = carregar_pedidos()
    pedidos.append(pedido)
    with open(PEDIDOS_FILE, 'w', encoding='utf-8') as f:
        json.dump(pedidos, f, ensure_ascii=False, indent=2)

@app.route('/')
def index():
    """Página principal - catálogo de produtos"""
    return render_template('index.html')

@app.route('/admin')
def admin():
    """Página de administração - ver pedidos"""
    return render_template('admin.html')

@app.route('/api/pedidos', methods=['POST'])
def criar_pedido():
    """Endpoint para criar um novo pedido"""
    try:
        dados = request.json
        
        pedido = {
            'id': len(carregar_pedidos()) + 1,
            'cliente': dados.get('cliente', 'Cliente Anônimo'),
            'telefone': dados.get('telefone', 'Não informado'),
            'endereco': dados.get('endereco', 'Não informado'),
            'itens': dados.get('itens', []),
            'total': dados.get('total', 0),
            'observacoes': dados.get('observacoes', ''),
            'status': 'Novo',
            'data': datetime.now().strftime('%d/%m/%Y %H:%M:%S')
        }
        
        salvar_pedido(pedido)
        
        print("\n" + "="*50)
        print("NOVO PEDIDO RECEBIDO!")
        print("="*50)
        print(f"ID: {pedido['id']}")
        print(f"Cliente: {pedido['cliente']}")
        print(f"Telefone: {pedido['telefone']}")
        print(f"Endereço: {pedido['endereco']}")
        print(f"Total: R$ {pedido['total']:.2f}")
        print("\nItens:")
        for item in pedido['itens']:
            print(f"  - {item['nome']} x{item['quantidade']} = R$ {item['subtotal']:.2f}")
        if pedido['observacoes']:
            print(f"\nObservações: {pedido['observacoes']}")
        print(f"\nData: {pedido['data']}")
        print("="*50 + "\n")
        
        return jsonify({'success': True, 'pedido_id': pedido['id']}), 201
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/pedidos', methods=['GET'])
def listar_pedidos():
    """Endpoint para listar todos os pedidos"""
    pedidos = carregar_pedidos()
    pedidos.reverse()
    return jsonify(pedidos)

@app.route('/api/pedidos/<int:pedido_id>/status', methods=['PUT'])
def atualizar_status(pedido_id):
    """Endpoint para atualizar o status de um pedido"""
    try:
        dados = request.json
        novo_status = dados.get('status')
        
        pedidos = carregar_pedidos()
        for pedido in pedidos:
            if pedido['id'] == pedido_id:
                pedido['status'] = novo_status
                with open(PEDIDOS_FILE, 'w', encoding='utf-8') as f:
                    json.dump(pedidos, f, ensure_ascii=False, indent=2)
                return jsonify({'success': True})
        
        return jsonify({'success': False, 'error': 'Pedido não encontrado'}), 404
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

if __name__ == '__main__':
    print("\n" + "="*50)
    print("SISTEMA DE PEDIDOS ONLINE")
    print("="*50)
    print("Servidor iniciando...")
    print("Acesse: http://localhost:5000")
    print("Admin: http://localhost:5000/admin")
    print("="*50 + "\n")
    app.run(debug=True, host='0.0.0.0', port=5000)

