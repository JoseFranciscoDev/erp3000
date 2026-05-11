import mysql from 'mysql2/promise'

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'erp3000',
}

export const salvarCliente = async (cliente) => {
    try {

        const novaConexao = await mysql.createConnection(dbConfig);
        const sql = 'INSERT INTO clientes (nome, email, cidade) VALUES (?, ?, ?)'
        const values = [cliente.nome, cliente.email, cliente.cidade]
        await novaConexao.execute(sql, values)
    } catch (error) {
        console.error("Erro ao salvar cliente:", error)
    }
    finally {
        await novaConexao.end()
    }

}

export const salvarPedidoCompleto = async (dadosPedido) => {
    const novaConexao = await mysql.createConnection(dbConfig);

    try {
        await novaConexao.beginTransaction();

        const sqlPedido = 'INSERT INTO pedidos (id_cliente) VALUES (?)';
        const [resultPedido] = await novaConexao.execute(sqlPedido, [dadosPedido.idCliente]);

        const idPedidoGerado = resultPedido.insertId;

        const sqlItem = 'INSERT INTO itens_pedido (id_pedido, id_produto, quantidade) VALUES (?, ?, ?)';

        for (const item of dadosPedido.itens) {
            await novaConexao.execute(sqlItem, [
                idPedidoGerado,
                item.idProduto,
                item.quantidade
            ]);
        }

        await novaConexao.commit();
        return { success: true, message: `Pedido ${idPedidoGerado} com ${dadosPedido.itens.length} itens salvo!` };

    } catch (error) {
        await novaConexao.rollback();
        throw error;
    } finally {
        await novaConexao.end();
    }
}