const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  sendNotification: (title, body, deepLink) => ipcRenderer.send('notification', { title, body, deepLink }),
  onNotificationClick: (callback) => ipcRenderer.on('notification-click', (event, deepLink) => callback(deepLink)),
  onDeepLink: (callback) => ipcRenderer.on('deep-link', (event, url) => callback(url))
});
