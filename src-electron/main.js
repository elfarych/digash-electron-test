import { app, BrowserWindow, session, ipcMain, dialog, Notification } from 'electron';
import pkg from 'electron-updater';
const { autoUpdater } = pkg;
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let deeplinkUrl = null;

app.setAsDefaultProtocolClient('digash');

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, argv) => {
    const deepLink = argv.find(arg => arg.startsWith('digash://'));
    if (deepLink && mainWindow) {
      mainWindow.webContents.send('deep-link', deepLink);
      mainWindow.focus();
    }
  });

  // MacOs
  app.on('open-url', (event, url) => {
    event.preventDefault();
    deeplinkUrl = url;
    if (mainWindow) {
      mainWindow.webContents.send('deep-link', deeplinkUrl);
    }
  });

  app.whenReady().then(async () => {

    // await session.defaultSession.setProxy({
    //   proxyRules: 'http=45.140.211.185:59100;https=45.140.211.185:59100'
    // });

    checkUpdates()


    mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      title: 'Digash',
      icon: path.join(__dirname, 'icon.png'),
      hasShadow: true,

      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false,
      },
    });
    mainWindow.setMenu(null);
    mainWindow.maximize();
    mainWindow.loadFile(path.join(__dirname, '../dist/angular/index.html'));
    mainWindow.webContents.openDevTools({ mode: 'detach' });

    const deepArg = process.argv.find(arg => arg.startsWith('digash://'));
    if (deepArg) {
      mainWindow.webContents.once('did-finish-load', () => {
        mainWindow.webContents.send('deep-link', deepArg);
      });
    }
  });

  app.on('login', (event, webContents, request, authInfo, callback) => {
    if (authInfo.isProxy) {
      event.preventDefault();
      callback('elfarych', 'SSVeuWNsrU');
    }
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
}


ipcMain.on('notification', (event, { title, body, deepLink  }) => {
  const notification = new Notification({ title, body });

  notification.on('click', () => {
    if (mainWindow) {
      mainWindow.webContents.send('notification-click', deepLink);
    }
  });

  notification.show();
});


const server = 'http://127.0.0.1:8000';
const feed = `${server}/desktop/update/windows/`;


export function checkUpdates () {
  autoUpdater.setFeedURL({
    provider: 'generic',
    url: feed
  });


  autoUpdater.checkForUpdates();

  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    const dialogOpts = {
      type: 'info',
      buttons: ['Перезапустить', 'Позже'],
      title: 'Обновление',
      message: process.platform === 'win32' ? releaseNotes : releaseName,
      detail: 'Доступна новая версия приложения. Перезапустить сейчас?'
    };
    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) autoUpdater.quitAndInstall();
    });
  })

  autoUpdater.on('error', (err) => {
    console.error('Ошибка обновления:', err);
  });
}
