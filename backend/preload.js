const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  fetchUrl: (url) => ipcRenderer.send('fetch-url', url),
  onBodyContent: (callback) => ipcRenderer.on('body-content', (event, content) => callback(content)),
});
