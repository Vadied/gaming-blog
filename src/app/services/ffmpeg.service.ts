import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

@Injectable({
  providedIn: 'root',
})
export class FfmpegService {
  isReady = false;
  private ffmpeg;

  constructor() {
    this.ffmpeg = createFFmpeg({ log: true });
  }

  async init() {
    if (this.isReady) return;

    await this.ffmpeg.load();
    this.isReady = true;
  }

  async getScreenshots(file: File): Promise<Array<string>> {
    const data = await fetchFile(file);
    this.ffmpeg.FS('writeFile', file.name, data);

    const seconds = [1, 2, 3];
    const commands: string[] = seconds.map((s) => [
      // Input
      '-i', file.name,
      // Outputs Options
      '-ss', `00:00:0${s}`,
      '-frames:v', '1',
      '-filter:v', 'scale=510:-1',
      // Output
      `output_0${s}_png`,
    ].join(""));

    await this.ffmpeg.run(...commands);

    return seconds.map(s => {
      const screenshotFile = this.ffmpeg.FS("readFile", `output_0${s}_png`)
      const screenshotBlob = new Blob(
        [screenshotFile.buffer], 
        {type: "image/png"}
      );

      return URL.createObjectURL(screenshotBlob);
    })
  }
}
