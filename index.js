/*create database erp3000;
use erp3000;
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    cidade VARCHAR(50),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO clientes (nome, email, cidade) VALUES 
('Ana Silva', 'ana.silva@email.com', 'Teresina'),
('Bruno Oliveira', 'bruno.o@email.com', 'São Raimundo Nonato'),
('Carla Souza', 'carla.souza@email.com', 'Picos'),
('Diego Santos', 'diego.santos@email.com', 'Floriano'),
('Fernanda Lima', 'fernanda.l@email.com', 'Bom Jesus');
CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    estoque INT NOT NULL DEFAULT 0
);

INSERT INTO produtos (nome, preco, estoque) VALUES 
('Mouse Gamer RGB', 159.90, 50),
('Teclado Mecânico', 320.00, 30),
('Monitor 24 Polegadas', 899.00, 15),
('Headset Wireless', 450.00, 20),
('Webcam Full HD', 210.50, 25);

CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT,
    id_produto INT,
    quantidade INT NOT NULL,
    data_pedido DATE,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id),
    FOREIGN KEY (id_produto) REFERENCES produtos(id)
);

alter table pedidos add column status enum('pendente', 'entregue');

INSERT INTO pedidos (id_cliente, id_produto, status, quantidade, data_pedido) VALUES 
(1, 3, 'pendente', 1, '2026-05-01'),
(2, 1, 'entregue', 2, '2026-05-02'),
(3, 5, 'pendente', 1, '2026-05-03'),
(4, 2, 'pendente', 1, '2026-05-04'),
(5, 4, 'pendente', 1, '2026-05-05');

SELECT 
    p.id AS 'Nº Pedido',
    p.status AS 'Status do Pedido',
    c.nome AS 'Cliente',
    pr.nome AS 'Produto',
    p.quantidade AS 'Qtd',
    (p.quantidade * pr.preco) AS 'Total'
FROM pedidos p
JOIN clientes c ON p.id_cliente = c.id
JOIN produtos pr ON p.id_produto = pr.id;*/

import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as db from './db.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1920,
        height: 1080,
        // fullscreen: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('index.html')
}

app.whenReady().then(() => {
    ipcMain.handle('ping', () => {
        return 'pong'
    })

    ipcMain.handle('salvar-cliente', async (event, cliente) => {
        await db.salvarCliente(cliente)
        return 'Cliente salvo com sucesso!'
    })

    ipcMain.handle('salvar-pedido', async (event, pedido) => {
        await db.salvarPedido(pedido)
        return 'Pedido salvo com sucesso!'
    })

    createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})