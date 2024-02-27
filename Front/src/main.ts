import { BrowserWindow, app, Menu, ipcMain, dialog, OpenDialogOptions, globalShortcut } from 'electron';
import { menu } from './menu';
import path from 'node:path';
import { CandyInfo } from './web/CandyInfo';
import { ChildProcessWithoutNullStreams, spawn } from 'node:child_process';
const Store = require('electron-store')
const store = new Store()
const audioFileExtensions = ['mp3', 'flv', 'ogg', 'wav'];

async function handleFileOpen(browserWindow: BrowserWindow, options: OpenDialogOptions): Promise<string[]> {
  const { canceled, filePaths } = await dialog.showOpenDialog(browserWindow, options)
  if (!canceled) {
    return filePaths;
  }
  return [""];
}

function updateCandy(candyInfos: Array<CandyInfo>) {
  if (candyInfos && candyInfos.length !== 0) {
    store.set('CandyInfos', candyInfos);
  }
}

function playAudio(filePath: string) {
  core.stdin.write(`play \"${filePath}\" \n`);
}

function changeMic(deviceLabel: string) {
  const command = `input \"${deviceLabel}\" \n`;
  core.stdin.write(command);
  store.set('input', deviceLabel);
}

function changeMixer(deviceLabel: string) {
  const command = `mixer \"${deviceLabel}\" \n`;
  core.stdin.write(command);
  store.set('mixer', deviceLabel);
}

function getCandyFromStore(): Array<CandyInfo> {
  const cachedInfos: Array<CandyInfo> = store.has('CandyInfos') ? store.get('CandyInfos') : [];
  return cachedInfos;
}

function getAudioDevicesFromStore(): [string, string] {
  const tpl: [string, string] = ["", ""];
  tpl[0] = store.has('input') ? store.get('input') : "";
  tpl[1] = store.has('mixer') ? store.get('mixer') : "";
  return tpl;
}


const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock)
  app.exit();

Menu.setApplicationMenu(menu);


function spawnCoreProcess(): ChildProcessWithoutNullStreams {
  const command = 'core/TrocheCore.exe';
  return spawn(command, []);
}

const core = spawnCoreProcess();

app.whenReady().then(() => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      // webpack が出力したプリロードスクリプトを読み込み
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  ipcMain.handle('dialog:openFile', async (_e, _arg) => {
    const filePathArray = await handleFileOpen(mainWindow, {
      filters: [
        { name: 'Audios', extensions: audioFileExtensions },
      ],
      properties: [
        'openFile',
      ],
    });
    return filePathArray[0];
  });

  ipcMain.handle('openFilesDialog', async (_e, _arg) => {
    const filePathArray = await handleFileOpen(mainWindow, {
      filters: [
        { name: 'Audios', extensions: audioFileExtensions },
      ],
      properties: [
        'openFile',
        'multiSelections'
      ],
    });
    return filePathArray;
  });

  ipcMain.handle('get:candyFromStore', (_e, _arg) => {
    return getCandyFromStore();
  });

  ipcMain.handle('getAudioDevicesFromStore', (_e, _arg) => {
    return getAudioDevicesFromStore();
  });

  ipcMain.on('updateCandyStore', (_e, _arg: Array<CandyInfo>) => {
    updateCandy(_arg);
  });

  ipcMain.on('playAudio', (_e, _arg: string) => {
    playAudio(_arg);
  });

  ipcMain.on('changeMixer', (_e, _arg: string) => {
    changeMixer(_arg);
  });

  ipcMain.on('changeMic', (_e, _arg: string) => {
    changeMic(_arg);
  });



  mainWindow.loadFile('dist/index.html');
});

app.once('window-all-closed', () => app.quit());

app.on('will-quit', () => {
  core.stdin.write("e\n");
  globalShortcut.unregisterAll();
});