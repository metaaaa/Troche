import { useEffect, useState } from "react";
import { CandyInfo } from "./CandyInfo";
import { AudioFileSelect, getFileNameFromPath } from "./Util";

export function candyPropsToCandyInfo(candyProps: CandyProps): CandyInfo {
    return new CandyInfo(candyProps.id, candyProps.path);
}


export class CandyProps {
    id: number = 0;
    path: string = "";
    onFileSelected?: (id: number, path: string) => void;
    onPlay?: (path: string) => void;
    onDelete?: (id: number) => void;
};

export const Candy: React.FC<CandyProps> = ({ id, path, onFileSelected, onPlay, onDelete }) => {
    function onClickPlay() {
        onPlay && onPlay(path ?? "");
    }

    function onClickDelete() {
        onDelete && onDelete(id);
    }

    async function onClickFileButton() {
        const filePath = await AudioFileSelect();
        if(filePath == "") return;

        onFileSelected && onFileSelected(id, filePath);
    }

    const [pressedKeys, setPressedKeys] = useState<string[]>([]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
        const key = event.code;
        if (!pressedKeys.includes(key)) {
            setPressedKeys(prevKeys => [...prevKeys, key]);
        }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
        const key = event.code;
        setPressedKeys(prevKeys => prevKeys.filter(k => k !== key));
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        };
    }, [pressedKeys]);

    let pressedKeysString = "";
    for (let pressedKey of pressedKeys) {
        if(pressedKeysString !== "") pressedKeysString += " + ";
        pressedKeysString += pressedKey;
    }

    return (
        <div className='rounded bg-base-300 flex p-2 mt-2'>
            <button className="btn w-1/4 btn-neutral mr-2" onClick={onClickFileButton}>
                {getFileNameFromPath(path)}
            </button>
            <button className="btn btn-primary mr-2" onClick={onClickPlay}>Play</button>
            <div>{pressedKeysString}</div>
            <button className="btn btn-secondary ml-auto" onClick={onClickDelete}>X</button>
        </div>
    );
}