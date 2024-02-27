using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using NAudio.Wave;

namespace TrocheCore.src
{
    public class AudioPlayer
    {
        private DirectSoundOut? _directSoundOut = null;
        private MediaFoundationReader? _mediaFoundationReader = null;

        public void Dispose()
        {
            _directSoundOut?.Stop();
            _directSoundOut?.Dispose();
            _mediaFoundationReader?.Dispose();
        }

        public async Task PlayAudioAsync(string audioFilePath, Guid deviceId, CancellationToken ct)
        {
            Dispose();
            _directSoundOut = new DirectSoundOut(deviceId);
            _mediaFoundationReader = new MediaFoundationReader(audioFilePath);

            _directSoundOut.Init(new WaveChannel32(_mediaFoundationReader));

            _directSoundOut.Play();

            Task waitForValueTask = Task.Run(async () =>
            {
                while (_directSoundOut.PlaybackPosition < _mediaFoundationReader.TotalTime 
                    && _directSoundOut.PlaybackState == PlaybackState.Playing)
                {
                    ct.ThrowIfCancellationRequested();
                    await Task.Delay(10, cancellationToken:ct);
                }
            }, ct);

            try
            {
                await waitForValueTask;
            }
            catch (OperationCanceledException)
            {
                Dispose();
            }
            Dispose();
        }
    }
}