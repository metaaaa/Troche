import { CandyInfo } from "./web/CandyInfo";

const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('myAPI', {
    openFileDialog: () => ipcRenderer.invoke('dialog:openFile'),
    openFilesDialog: () => ipcRenderer.invoke('openFilesDialog'),
    getCandyFromStore: () => ipcRenderer.invoke('get:candyFromStore'),
    getAudioDevicesFromStore: () => ipcRenderer.invoke('getAudioDevicesFromStore'),
    updateCandyStore: (candyInfos: Array<CandyInfo>) => ipcRenderer.send('updateCandyStore', candyInfos),
    playAudio: (path: string) => ipcRenderer.send('playAudio', path),
    changeMixer: (deviceLabel: string) => ipcRenderer.send('changeMixer', deviceLabel),
    changeMic: (deviceLabel: string) => ipcRenderer.send('changeMic', deviceLabel),
});
