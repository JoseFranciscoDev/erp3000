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

    ipcMain.on('ir-para-home', (event) => {
        const win = BrowserWindow.getFocusedWindow();
        win.loadFile('index.html')
    })

    ipcMain.handle('salvar-cliente', async (event, cliente) => {
        await db.salvarCliente(cliente)
        return 'Cliente salvo com sucesso!'
    })

    ipcMain.handle('salvar-pedido', async (event, pedido) => {
        await db.salvarPedido(pedido)
        return 'Pedido salvo com sucesso!'
    })

    ipcMain.handle('salvar-produto', async (event, produto) => {
        await db.salvarProduto(produto)
        return 'Produto salvo com sucesso!'
    })

    ipcMain.handle('obter-pedidos', async () => {
        const pedidos = await db.obterPedidos()
        console.log(pedidos)
        return pedidos
    })

    createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})