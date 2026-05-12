Aqui está um modelo de README.md profissional e direto ao ponto, ideal para o seu repositório no GitHub. Ele cobre desde os pré-requisitos até a configuração do banco de dados, que é a parte mais sensível do seu projeto.

ERP 3000 - Sistema de Gestão 🚀
O ERP 3000 é uma aplicação desktop desenvolvida com Electron, focada no gerenciamento de clientes, produtos e pedidos. O projeto utiliza Node.js no processo principal e MySQL para persistência de dados, implementando transações robustas para garantir a integridade dos pedidos.

🛠️ Tecnologias Utilizadas
Electron: Framework para criação de apps desktop.

Node.js: Ambiente de execução backend.

MySQL: Banco de dados relacional.

JavaScript (ESM): Padrão moderno de módulos.

📋 Pré-requisitos
Antes de começar, você precisará ter instalado em sua máquina:

Node.js (Versão 18 ou superior recomendada)

MySQL Server

Gerenciador de pacotes (npm ou yarn)

🏗️ Configuração do Banco de Dados
Abra o seu terminal MySQL ou um cliente como MySQL Workbench.

Execute o script SQL abaixo para criar a estrutura necessária:

SQL
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
    preco_unitario DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES produtos(id)
);
Atenção: Certifique-se de configurar suas credenciais (usuário e senha) no arquivo db.js antes de rodar a aplicação.

🚀 Como Rodar o Projeto
Clone o repositório:

Bash
git clone https://github.com/seu-usuario/erp3000.git
cd erp3000
Instale as dependências:

Bash
npm install
Inicie a aplicação:

Bash
npm start
📁 Estrutura do Projeto
main.js: Processo principal (gerenciamento de janelas e IPC).

preload.js: Ponte de segurança entre o sistema e o frontend.

renderer.js: Lógica da interface do usuário.

db.js: Conexão e consultas ao banco de dados MySQL.

index.html: Interface principal do sistema.

📝 Funcionalidades Implementadas
[x] Cadastro de Clientes.

[x] Cadastro de Produtos.

[x] Cadastro de Pedidos com Múltiplos Itens.

[x] Uso de Transações SQL (Commit/Rollback) para segurança dos dados.

[x] Comunicação assíncrona via ipcMain e ipcRenderer.
