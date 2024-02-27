import './App.css';
import { useState, useEffect, useCallback } from 'react';
import { AudioFilesSelect } from './Util';
import { CandyProps, candyPropsToCandyInfo } from './Candy';
import { CandyList } from './CandyList';
import { AudioDevices } from './AudioDevices';

export const App = () => {

    const initialCandyInfos: Array<CandyProps> = [];
    const initialAudioDeveiceListInfo: Array<MediaDeviceInfo> = [];
    const [candyListInfo, setCandyListInfo] = useState(initialCandyInfos);
    const [audioDeveiceListInfo, setAudioDeveiceListInfo] = useState(initialAudioDeveiceListInfo);
    const [currentInput, setCurrentInput] = useState("");
    const [currentOutput, setCurrentOutput] = useState("");

    const onPlay = (path: string) => {
        console.log(path);
        window.myAPI.playAudio(path);
    }

    const onDelete = useCallback((id: number) => {
        setCandyListInfo((prev) => {
            const newList = prev.filter(x => x.id !== id);
            storeCandy(newList);
            return newList;
        });
    }, [candyListInfo]);

    const onFileSelected = (id: number, path: string) => {
        setCandyListInfo((prev) => {
            const newList = prev.slice();
            const selected = newList.find(x => x.id === id);
            if (selected) {
                const idx = newList.indexOf(selected);
                newList[idx] = {
                    id: id,
                    path: path,
                    onFileSelected: onFileSelected,
                    onPlay: onPlay,
                    onDelete: onDelete,
                };
            }
            storeCandy(newList);
            return newList;
        });
    }

    function onMicChanged(label: string) {
        window.myAPI.changeMic(label);
        setCurrentInput(label);
    }

    function onMixerChanged(label: string) {
        console.log(label);
        window.myAPI.changeMixer(label);
        setCurrentOutput(label);
    }

    function storeCandy(newCandy: Array<CandyProps>) {
        console.log('updated: ', newCandy);
        const temp = newCandy.map((x) => candyPropsToCandyInfo(x));
        console.log('new: ', temp);
        let jsn = JSON.stringify(temp);
        console.log('new: ', jsn);
        window.myAPI.updateCandyStore(temp);
    }

    async function initCandyList() {
        let candyPropsArray = (await window.myAPI.getCandyFromStore());

        const initialCandyInfos: Array<CandyProps> = candyPropsArray.map((item) => ({
            id: item.id,
            path: item.path,
            onFileSelected: onFileSelected,
            onPlay: onPlay,
            onDelete: onDelete,
        }));

        setCandyListInfo(initialCandyInfos);
    }

    async function initAudioDeviceList() {
        const audioDevices = await navigator.mediaDevices.enumerateDevices();
        setAudioDeveiceListInfo(audioDevices);

        const storedDevices = await window.myAPI.getAudioDevicesFromStore();
        const inputDevices = audioDevices.filter(x => x.kind === "audioinput");
        const outputDevices = audioDevices.filter(x => x.kind === "audiooutput");

        if (audioDevices.find(x => x.label === storedDevices[0])) {
            onMicChanged(storedDevices[0]);
        } else if (inputDevices.length !== 0) {
            onMicChanged(inputDevices[0].label);
        }

        if (audioDevices.find(x => x.label === storedDevices[1])) {
            onMixerChanged(storedDevices[1]);
        } else if (inputDevices.length !== 0) {
            onMixerChanged(outputDevices[0].label);
        }
    }

    function registerEvents() {
        navigator.mediaDevices.addEventListener('devicechange', initAudioDeviceList);
    }

    function unregisterEvents() {
        navigator.mediaDevices.removeEventListener('devicechange', initAudioDeviceList);
    }

    useEffect(() => {
        console.log("uooo");
        initCandyList();
        initAudioDeviceList();

        unregisterEvents();
        registerEvents();
    }, []);


    const AddCandy = useCallback(async () => {
        const filePaths = await AudioFilesSelect();

        const candyListInfoNew = candyListInfo.slice();
        let lastId = candyListInfoNew[candyListInfoNew.length - 1]?.id ?? -1;

        for (const filePath of filePaths) {
            if (!filePath || filePath === "") continue;

            const newProp: CandyProps = {
                id: lastId + 1,
                path: filePath,
                onFileSelected: onFileSelected,
                onPlay: onPlay,
                onDelete: onDelete,
            };
            candyListInfoNew.push(newProp);
            lastId++;
        }


        setCandyListInfo(candyListInfoNew);
        storeCandy(candyListInfoNew);
    }, [candyListInfo]);

    return (
        <div className='mx-4'>
            <div className='mt-4'>
                <AudioDevices
                    devices={audioDeveiceListInfo}
                    currentInput={currentInput}
                    currentOutput={currentOutput}
                    onMicChanged={onMicChanged}
                    onMixerChanged={onMixerChanged}
                />
            </div>
            <CandyList items={candyListInfo} />
            <div className='mt-4 w-full flex justify-center'>
                <button className="btn btn-accent items-center" onClick={AddCandy}>
                    Add
                </button>
            </div>
        </div>
    );
};
