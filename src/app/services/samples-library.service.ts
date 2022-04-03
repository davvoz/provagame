import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SamplesLibraryService {
  public buffers = [];
  constructor(private _audioContext: AudioContext) {
    this.loadSounds('../../assets/wav/bigkick1.wav'); // hit
    this.loadSounds('../../assets/wav/HAT2alfa.wav');//src\assets\wav\disto rtm.wav
    this.loadSounds('../../assets/wav/xcrash.wav');
    this.loadSounds('../../assets/wav/disto_rtm.wav');//
    this.loadSounds('../../assets/wav/40_Dark_Voice_Vol_2.wav');
  }

  private loadSounds(path: string): void {
    const request = new XMLHttpRequest();
    request.open('GET', path, true);
    request.responseType = 'arraybuffer';
    const context = this._audioContext;
    request.onload = () => {
      context.decodeAudioData(
        request.response,
        buffer => {
          if (!buffer) {
            alert('error decoding file data: ' + path);
            return;
          }
          // @ts-ignore*/
          this.buffers.push(buffer);
        },
        error => {
          console.error('decodeAudioData error', error);
        }
      );
    };
    request.onerror = () => {
      throw Error("Load sound failed")
    };
    request.send();
  }
}
