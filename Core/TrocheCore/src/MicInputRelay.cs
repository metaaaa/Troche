using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using NAudio.CoreAudioApi;
using NAudio.Wave;
using NAudio.Wave.SampleProviders;

namespace TrocheCore.src
{
    public class MicInputRelay
    {
        private BufferedWaveProvider? _bufferedwaveprovider = null;
        private WaveInEvent? _waveIn = null;
        private WaveOut? _waveOut = null;
        public void StartRecording(int input, int output)
        {
            _waveIn = new WaveInEvent()
            {
                DeviceNumber = input,
            };
            _waveIn.DataAvailable += WaveinDataavailable;
            _waveIn.WaveFormat = new WaveFormat(48000, 1);
            _waveOut = new WaveOut()
            {
                DeviceNumber = output,
            };
            _bufferedwaveprovider = new BufferedWaveProvider(_waveIn.WaveFormat)
            {
                DiscardOnBufferOverflow = true
            };
            _waveOut.Init(_bufferedwaveprovider);

            _waveIn.StartRecording();
            _waveOut.Play();
        }

        private void WaveinDataavailable(object? sender, WaveInEventArgs e)
        {
            _bufferedwaveprovider?.AddSamples(e.Buffer, 0, e.BytesRecorded);
        }

        public void StopRecording()
        {
            _waveIn?.StopRecording();
            _waveIn?.Dispose();
            _waveOut?.Stop();
            _waveOut?.Dispose();
        }
    }
}