export type AudioDevicesProps = {
    devices: Array<MediaDeviceInfo>;
    currentInput: string;
    currentOutput: string;
    onMicChanged?: (label: string) => void;
    onMixerChanged?: (label: string) => void;
};

export const AudioDevices: React.FC<AudioDevicesProps> = ({ devices, currentInput, currentOutput, onMicChanged, onMixerChanged }) => {
    const inputDevices = devices.filter(x => x.kind === "audioinput");
    const outputDevices = devices.filter(x => x.kind === "audiooutput");

    if (currentInput === "" && inputDevices.length !== 0) {
        currentInput = inputDevices[0].label;
    }

    if (currentOutput === "" && outputDevices.length !== 0) {
        currentOutput = outputDevices[0].label;
    }

    return (
        <div className="">
            <div className="flex gap-4">
                <div>
                    <div className="text-lg font-semibold mx-2">
                        <div className="">
                            InputDevice
                        </div>
                    </div>
                    <ul className="menu bg-base-200 w-56 rounded-box">
                        <li>
                            <details>
                                <summary>{currentInput}</summary>
                                <ul>
                                    {inputDevices?.filter(x => x?.label !== currentInput).map((item, index) =>
                                    (<li key={item?.deviceId}>
                                        <button onClick={() => onMicChanged && onMicChanged(item?.label)}>
                                            {item?.label}
                                        </button>
                                    </li>)
                                    )}
                                </ul>
                            </details>
                        </li>
                    </ul>
                </div>

                <div>
                    <div className="text-lg font-semibold mx-2">
                        <div className="">
                            MixerDevice
                        </div>
                    </div>
                    <ul className="menu bg-base-200 w-56 rounded-box">
                        <li>
                            <details>
                                <summary>{currentOutput}</summary>
                                <ul>
                                    {outputDevices?.filter(x => x?.label !== currentOutput).map((item, index) =>
                                    (<li key={item?.deviceId}>
                                        <button onClick={() => onMixerChanged && onMixerChanged(item?.label)}>
                                            {item?.label}
                                        </button>
                                    </li>)
                                    )}
                                </ul>
                            </details>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

