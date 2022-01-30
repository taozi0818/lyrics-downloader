import { AbsDownloader, BaseDownloader, SongFile, BaseDownloaderConfig } from './base';
import NeteaseDownloader from './netease';
import QQDownloader from './qq';

interface DownloadConfig extends BaseDownloaderConfig {
  priorityWorker: AbsDownloader[];
}

export default class Downloader extends BaseDownloader implements AbsDownloader {
  private readonly priorityWorker: AbsDownloader[] = [
    new NeteaseDownloader(),
    new QQDownloader(),
  ];

  constructor(opts?: DownloadConfig) {
    super(opts);
    this.priorityWorker = opts?.priorityWorker || this.priorityWorker;
  }

  public async downloadLyrics(song: SongFile) {
    for (let downloader of this.priorityWorker) {
      const r = await downloader.downloadLyrics(song);

      if (r.success) {
        return r;
      }
    }

    return { success: false };
  }
}
