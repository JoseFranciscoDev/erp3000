const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    ping: () => ipcRenderer.invoke('ping'),
    salvarCliente: (cliente) => ipcRenderer.invoke('salvar-cliente', cliente)
    // we can also expose variables, not just functions
})