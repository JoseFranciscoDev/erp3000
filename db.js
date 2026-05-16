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
        const sqlEstoque = 'SELECT estoque FROM produtos WHERE id = ?';
        const sqlPedido = 'INSERT INTO pedidos (id_cliente, status, data_pedido) VALUES (?, ? , ?)';
        const [resultPedido] = await novaConexao.execute(sqlPedido, [dadosPedido.idCliente, 'entregue', data]);

        const idPedidoGerado = resultPedido.insertId;

        const sqlItem = 'INSERT INTO itens_pedido (id_pedido, id_produto, quantidade) VALUES (?, ?, ?)';

        for (const item of dadosPedido.itens) {
            const [estoqueResult] = await novaConexao.execute(sqlEstoque, [item.idProduto]);
            const estoqueDisponivel = estoqueResult[0].estoque;
            console.log(estoqueResult)

            if (item.quantidade > estoqueDisponivel) {
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

export const criarTabelas = async () => {
    const novaConexao = await mysql.createConnection(dbConfig);
    try {
        await novaConexao.query(`
            CREATE TABLE IF NOT EXISTS clientes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                cidade VARCHAR(50),
                data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await novaConexao.query(`
            CREATE TABLE IF NOT EXISTS produtos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                preco DECIMAL(10, 2) NOT NULL,
                estoque INT NOT NULL DEFAULT 0
            )
        `);

        await novaConexao.query(`
            CREATE TABLE IF NOT EXISTS pedidos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                id_cliente INT,
                data_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (id_cliente) REFERENCES clientes(id)
            )
        `);

        await novaConexao.query(`
            CREATE TABLE IF NOT EXISTS itens_pedido (
                id INT AUTO_INCREMENT PRIMARY KEY,
                id_pedido INT NOT NULL,
                id_produto INT NOT NULL,
                quantidade INT NOT NULL,
                FOREIGN KEY (id_pedido) REFERENCES pedidos(id) ON DELETE CASCADE,
                FOREIGN KEY (id_produto) REFERENCES produtos(id)
            )
        `);
        console.log("Tabelas verificadas/criadas com sucesso!");
    } catch (error) {
        console.error("Erro ao criar tabelas:", error);
    } finally {
        await novaConexao.end();
    }
};
