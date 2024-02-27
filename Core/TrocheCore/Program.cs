using System;
using NAudio.Wave;
using TrocheCore.src;

namespace TrocheCore
{
    class Program
    {
        static void Main(string[] args)
        {

            var ap = new AudioPlayer();
            var outDeviceGuid = DirectSoundOut.DSDEVID_DefaultPlayback;
            var inputDeviceId = 0;
            var outputDeviceId = 0;

            var cts = new CancellationTokenSource();

            var mir = new MicInputRelay();
            mir.StartRecording(inputDeviceId, outputDeviceId);

            while (true)
            {
                var input = Console.ReadLine();
                input = input != null ? input.Trim() : "";

                if (input == "e")
                {
                    break;
                }

                var command = input.Split(" ")[0];

                if (command == "play")
                {
                    var commands = input.Split(" ", 2);
                    if (commands.Length < 2) continue;

                    cts.Cancel();
                    cts = new CancellationTokenSource();
                    var filePath = commands[1].Trim('\"');
                    _ = ap.PlayAudioAsync(filePath, outDeviceGuid, cts.Token);
                }


                if (command == "input")
                {
                    var commands = input.Split(" ", 2);
                    if (commands.Length < 2) continue;

                    var device = Util.GetInputDeviceByName(commands[1].Trim('\"'));
                    inputDeviceId = device != null ? device.index : 0;
                    mir.StopRecording();
                    mir.StartRecording(inputDeviceId, outputDeviceId);
                }

                if (command == "mixer")
                {
                    var commands = input.Split(" ", 2);
                    if (commands.Length < 2) continue;

                    var device = Util.GetOutputDeviceByName(commands[1].Trim('\"'));

                    outputDeviceId = device != null ? device.index : 0;
                    if (device?.deviceInfo != null)
                    {
                        outDeviceGuid = device.deviceInfo.Guid;
                    }
                    else
                    {
                        outDeviceGuid = DirectSoundOut.DSDEVID_DefaultPlayback;
                    }
                    mir.StopRecording();
                    mir.StartRecording(inputDeviceId, outputDeviceId);
                }
            }

            mir.StopRecording();
            ap.Dispose();
        }
    }
}