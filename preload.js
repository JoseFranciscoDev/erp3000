const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    ping: () => ipcRenderer.invoke('ping'),
    salvarCliente: (cliente) => ipcRenderer.invoke('salvar-cliente', cliente),
    salvarPedido: (pedido) => ipcRenderer.invoke('salvar-pedido', pedido),
    salvarProduto: (produto) => ipcRenderer.invoke('salvar-produto', produto),
    irParaHome: () => ipcRenderer.send('ir-para-home'),
    obterPedidos: () => ipcRenderer.invoke('obter-pedidos'),
    // we can also expose variables, not just functions
})