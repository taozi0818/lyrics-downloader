import { BaseDownloader, AbsDownloader, SongFile, BaseDownloaderConfig } from './base';
import axios, { AxiosInstance } from 'axios';
import chalk from 'chalk';
import { t } from '../i18n';

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
  private readonly API_BASE_URL = 'https://c.y.qq.com';
  private readonly API_ROUTER = {
    SearchSong: '/splcloud/fcgi-bin/smartbox_new.fcg',
    SearchLyrics: '/lyric/fcgi-bin/fcg_query_lyric_new.fcg',
  };
  private axios: AxiosInstance = axios.create({
    baseURL: this.API_BASE_URL,
  });

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

    const { data } = await this.axios.request<{ code: number; data: { song: SongList; }; }>({
      url: this.API_ROUTER.SearchSong,
      method: 'GET',
      headers: {
        referer: 'https://y.qq.com/',
      },
      params: {
        format: 'json',
        inCharset: 'utf-8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'yqq.json',
        needNewCode: 1,
        uin: 0,
        hostUin: 0,
        is_xml: 0,
        key: keywords,
      },
    });

    if (data?.code !== 0) {
      return { success: false };
    }

    const { song: songResult } = data.data;
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
    const { data } = await this.axios.request<{
      retcode: number;
      code: number;
      subcode: number;
      lyric: string;
    }>({
      url: this.API_ROUTER.SearchLyrics,
      method: 'GET',
      headers: {
        referer: 'https://y.qq.com/',
      },
      params: {
        format: 'json',
        inCharset: 'utf-8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'yqq.json',
        needNewCode: 0,
        uin: 0,
        loginUin: 0,
        songmid: id,
      },
    });

    const { lyric } = data;

    if (!lyric) {
      return '';
    }

    return Buffer.from(lyric, 'base64').toString();
  }
}
