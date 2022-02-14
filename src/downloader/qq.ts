import { BaseDownloader, AbsDownloader, SongFile, BaseDownloaderConfig } from './base';
import chalk from 'chalk';
import { t } from '../i18n';
import { QQ as QQApi } from 'music-platform-api';

export interface Song {
  docid: string;
  id: string;
  mid: string;
  name: string;
  singer: string;
}

interface SongList {
  count: number;
  itemlist: Array<Song>;
}

export default class QQDownloader extends BaseDownloader implements AbsDownloader {
  private platformApi = new QQApi()
  constructor(opts: BaseDownloaderConfig = {}) {
    super(opts);
  }

  public async downloadLyrics(name: string) {
    const song = this.parseFileName(name);

    try {
      const searchResult = await this.searchSong(song);
      const { result } = searchResult;
      const lyrics = await this.searchLyrics(result.mid);
      const { path: lyricsFilePath, name: lyricsFileName } = await this.handlerLyrics(song, lyrics);

      console.log(chalk.green(`${t('zh', 'lyrics.download_success')}: ${lyricsFileName}`));

      return { success: true };

    } catch (e) {
      console.log(chalk.bold.red(`${t('zh', 'lyrics.download_failed')}: ${song._filename}`));
      return { success: false };
    }
  }

  private async searchSong(song: SongFile) {
    const keywords = this.generateSearchWords(song);
    const res = await this.platformApi.search(keywords);

    if (res?.code !== 0) {
      return { success: false };
    }

    const { song: songResult } = res.data;
    let r: Song, artistMatched;

    for (let i of songResult.itemlist) {
      if (song.artist && i.name === song.name && song.artist === i.singer) {
        r = i;
        artistMatched = true;
        break;
      }

      // if (Math.abs(i.duration - mediaDuration) < this.durationError) {
      //   r = i;
      //   break;
      // }
    }

    return { success: r && true, artistMatched: artistMatched, result: r, };
  }

  private async searchLyrics(id: string) {
    return this.platformApi.getLyrics(id);
  }
}
