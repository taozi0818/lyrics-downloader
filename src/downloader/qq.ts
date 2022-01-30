import { BaseDownloader, AbsDownloader, SongFile } from './base';

export default class QQDownloader extends BaseDownloader implements AbsDownloader {
  public async downloadLyrics(song: SongFile) {
    return { success: false };
  }
}
