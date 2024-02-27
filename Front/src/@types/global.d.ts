import { CandyProps } from "../web/Candy";
import { CandyInfo } from "../web/CandyInfo";

declare global {
    interface Window {
        myAPI: IMyAPI;
    }
}
export interface IMyAPI {
    openFileDialog: () => string;
    openFilesDialog: () => Array<string>;
    getCandyFromStore: () => Array<CandyProps>;
    getAudioDevicesFromStore: () => [string, string];
    updateCandyStore: (candyInfos: Array<CandyInfo>) => void;
    playAudio: (path: string) => void;
    changeMixer: (deviceLabel: string) => void;
    changeMic: (deviceLabel: string) => void;
}