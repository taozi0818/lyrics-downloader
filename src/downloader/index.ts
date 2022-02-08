import { AbsDownloader, SongFile, BaseDownloaderConfig } from './base';
import NeteaseDownloader from './netease';
import QQDownloader from './qq';

interface DownloadConfig extends BaseDownloaderConfig {
  priorityWorker?: AbsDownloader[];
}

export default class Downloader {
  private readonly priorityWorker: AbsDownloader[];

  constructor(opts: DownloadConfig = {}) {
    this.priorityWorker = opts?.priorityWorker || [ new QQDownloader(opts) ];
    // this.priorityWorker = opts?.priorityWorker || [ new NeteaseDownloader(opts), new QQDownloader(opts) ];
  }

  public async downloadLyrics(name: string) {
    for (let downloader of this.priorityWorker) {
      const r = await downloader.downloadLyrics(name);

      if (r.success) {
        return r;
      }
    }

    return { success: false };
  }
}
