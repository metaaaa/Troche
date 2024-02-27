using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using NAudio.Wave;

namespace TrocheCore.src
{
    public class InputDevice
    {
        public int index = 0;
        public WaveInCapabilities? deviceInfo = null;
    }

    public class OutputDevice
    {
        public int index = 0;
        public DirectSoundDeviceInfo? deviceInfo = null;
    }

    public static class Util
    {
        public static InputDevice? GetInputDeviceByName(string name)
        {
            for (int n = -1; n < WaveIn.DeviceCount; n++)
            {
                var caps = WaveIn.GetCapabilities(n);
                if (name.StartsWith(caps.ProductName))
                {
                    return new InputDevice()
                    {
                        index = n,
                        deviceInfo = caps,
                    };
                }
            }
            return null;
        }

        public static OutputDevice? GetOutputDeviceByName(string name)
        {
            var idx = -1;
            foreach (var dev in DirectSoundOut.Devices)
            {
                if (name.StartsWith(dev.Description))
                {
                    return new OutputDevice()
                    {
                        index = idx,
                        deviceInfo = dev,
                    };
                }
                idx++;
            }
            return null;
        }
    }
}