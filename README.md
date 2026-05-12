# ERP 3000 - Sistema de Gestão Desktop 🚀

O **ERP 3000** é uma aplicação desktop desenvolvida com **Electron**, focada no gerenciamento de clientes, produtos e pedidos. Este projeto foi construído para demonstrar a integração entre processos do Electron, comunicação IPC segura e persistência em banco de dados relacional com transações.

## 🛠️ Tecnologias Utilizadas

* **Electron**: Framework para interface desktop.
* **Node.js**: Backend e gerenciamento de processos.
* **MySQL**: Banco de dados relacional.
* **JavaScript (ESM)**: Módulos modernos para o processo principal.

---

## 📋 Pré-requisitos

Antes de rodar a aplicação, você precisará de:
* [Node.js](https://nodejs.org/) (v18+)
* [MySQL Server](https://dev.mysql.com/) ativo.
* Gerenciador de pacotes `npm`.

---

## 🏗️ Configuração do Banco de Dados

1. Acesse seu terminal MySQL ou Workbench.
2. Crie o banco de dados e as tabelas executando o script abaixo:

```sql
CREATE DATABASE erp3000;
USE erp3000;

CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    cidade VARCHAR(50),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    estoque INT NOT NULL DEFAULT 0
);

CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT,
    data_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id)
);

CREATE TABLE itens_pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_produto INT NOT NULL,
    quantidade INT NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES produtos(id)
);
Nota: Lembre-se de atualizar as credenciais de acesso (host, user, password) no seu arquivo db.js.

🚀 Como Rodar o Projeto
Siga os comandos abaixo no seu terminal:

Clone o repositório:

Bash
git clone https://github.com/JoseFranciscoDev/erp3000.git
cd erp3000
Instale as dependências:

Bash
npm install
Inicie a aplicação:

Bash
npm start
📂 Estrutura de Arquivos
main.js: Coração da aplicação, gerencia janelas e eventos do sistema.

preload.js: Ponte de segurança (Context Bridge) entre o Node.js e o navegador.

db.js: Camada de persistência com funções assíncronas e transações SQL.

renderer.js: Lógica de interface e manipulação do DOM.

index.html: Dashboard principal.

🧠 Conceitos Aplicados
IPC (Inter-Process Communication): Uso de ipcMain.handle e ipcRenderer.invoke para comunicação assíncrona bidirecional.

Transações SQL: Implementação de beginTransaction, commit e rollback para garantir que um pedido só seja salvo se todos os seus itens forem registrados corretamente.

Segurança: Uso de contextBridge para evitar exposição direta de APIs do Node.js no frontend.
