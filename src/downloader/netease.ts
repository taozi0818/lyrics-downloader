import chalk from 'chalk';
import { Netease as NeteaseApi } from 'music-platform-api';
import { BaseDownloader, AbsDownloader, SongFile, BaseDownloaderConfig } from './base';
import { t } from '../i18n';

type EncryptBody = (o: any) => { encText: string; encSecKey: string; };

export interface Song {
  id: number;
  name: string;
  duration: number; // unit: millisecond
  artists: Array<{
    id: number,
    name: string;
  }>;
}

export default class NeteaseDownloader extends BaseDownloader implements AbsDownloader {
  private platformApi = new NeteaseApi();

  constructor(opts: BaseDownloaderConfig = {}) {
    super(opts);
  }

  public async downloadLyrics(name: string) {
    const song = this.parseFileName(name);

    try {
      const matchResult = await this.searchSong(song);
      const { result: songInfo } = matchResult;
      const songId = songInfo.id;
      const lyrics = await this.searchLyrics(songId);
      const { path: lyricsFilePath, name: lyricsFileName } = await this.handlerLyrics(song, lyrics);

      console.log(chalk.green(`${t('zh', 'lyrics.download_success')}: ${lyricsFileName}`));

      return { success: true, lyrics: lyricsFilePath };
    } catch (e) {
      console.log(chalk.bold.red(`${t('zh', 'lyrics.download_failed')}: ${song._filename}`));
      return { success: false };
    }
  }

  private async searchSong(song: SongFile) {
    const keywords = this.generateSearchWords(song);
    const res = await this.platformApi.search(keywords);
    const { songs } = res;
    const mediaMeta = await this.parseMediaFile(song._path);
    const mediaDuration = mediaMeta.format.duration * 1000;

    let r: Song, artistMatched = false;

    for (let i of songs) {
      if (song.artist && i.name === song.name && i.artists.some(art => art.name === song.artist)) {
        r = i;
        artistMatched = true;
        break;
      }

      if (Math.abs(i.duration - mediaDuration) < this.durationError) {
        r = i;
        break;
      }
    }

    return { success: r && true, artistMatched: artistMatched, result: r, };
  }

  private async searchLyrics(id: number) {
    return this.platformApi.getLyrics(id);
  }
}
