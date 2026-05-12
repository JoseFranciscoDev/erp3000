import mysql from 'mysql2/promise'
import dontenv from 'dotenv'
dontenv.config()

const dbConfig = {
    host: process.env.HOST || 'localhost',
    user: process.env.USER || 'root',
    password: process.env.PASSWORD || '1234',
    database: process.env.DATABASE || 'erp3000',
}

export const obterPedidos = async () => {
    const novaConexao = await mysql.createConnection(dbConfig)
    try {
        const sql = `SELECT p.id, c.nome AS nome_cliente, p.status, p.data_pedido
        FROM pedidos p
        JOIN clientes c ON p.id_cliente = c.id`
        const [pedidos] = await novaConexao.execute(sql)
        return pedidos
    }
    catch (error) {
        console.error("Erro ao obter pedidos:", error)
    }
}

export const salvarCliente = async (cliente) => {
    try {
        const novaConexao = await mysql.createConnection(dbConfig)
        const sql = 'INSERT INTO clientes (nome, email, cidade) VALUES (?, ?, ?)'
        const values = [cliente.nome, cliente.email, cliente.cidade]
        await novaConexao.execute(sql, values)
    } catch (error) {
        console.error("Erro ao salvar cliente:", error)
    }
}

export const salvarPedido = async (dadosPedido) => {
    const novaConexao = await mysql.createConnection(dbConfig)
    const data = new Date().toISOString().slice(0, 10)

    try {
        await novaConexao.query('START TRANSACTION');
        const sqlEsoque = 'SELECT estoque FROM produtos WHERE id = ?';
        const sqlPedido = 'INSERT INTO pedidos (id_cliente, status, data_pedido) VALUES (?, ? , ?)';
        const [resultPedido] = await novaConexao.execute(sqlPedido, [dadosPedido.idCliente, 'entregue', data]);

        const idPedidoGerado = resultPedido.insertId;

        const sqlItem = 'INSERT INTO itens_pedido (id_pedido, id_produto, quantidade) VALUES (?, ?, ?)';

        for (const item of dadosPedido.itens) {
            const [estoqueResult] = await novaConexao.execute(sqlEsoque, [item.idProduto]);
            const estoqueDisponivel = estoqueResult[0].estoque;

            if (item.quantidade >= estoqueDisponivel) {
                novaConexao.query('ROLLBACK')
                throw new Error(`Produto ${item.idProduto} tem estoque insuficiente! Disponível: ${estoqueDisponivel}`);
            }
            await novaConexao.execute(sqlItem, [
                idPedidoGerado,
                item.idProduto,
                item.quantidade
            ]);
        }

        await novaConexao.query('COMMIT');
        return { success: true, message: `Pedido ${idPedidoGerado} com ${dadosPedido.itens.length} itens salvo!` };

    } catch (error) {
        await novaConexao.query('ROLLBACK')
        throw error;
    } finally {
        await novaConexao.end();
    }
}

export const salvarProduto = async (produto) => {
    const novaConexao = await mysql.createConnection(dbConfig)
    try {
        const sql = 'INSERT INTO produtos (nome, preco, estoque) VALUES (?, ?,?)'
        const values = [produto.nome, produto.preco, produto.estoque || 0]
        await novaConexao.execute(sql, values)
    }
    catch (error) {
        console.error("Erro ao salvar produto:", error)
    }
    finally {
        await novaConexao.end()
    }
}