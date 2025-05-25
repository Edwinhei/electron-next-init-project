const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    sayHello: (name)=>ipcRenderer.invoke('say-hello', name),
    sendAnotherMessage: (message) => ipcRenderer.send('another-message', message),
    onReplyToAnotherMessage: (callback) => ipcRenderer.on('reply-to-another-message', (event, message) => callback(message))
})