import qs from 'qs';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import axios, { AxiosInstance } from 'axios';
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

export interface Lyrics {
  songStatus: number;
  lyricVersion: number;
  lyric: string;
  code?: number;
}

const { encrypt }: { encrypt: EncryptBody } = require('../utils/cryptoNetease');

export default class NeteaseDownloader extends BaseDownloader implements AbsDownloader {
  private readonly API_BASE_URL = `https://music.163.com`;
  private readonly API_ROUTER = {
    SearchSong: '/weapi/search/suggest/web',
    SearchLyrics: '/api/song/media'
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
    const encBody = encrypt({
      s: this.generateSearchWords(song),
      limit: "8",
      csrf_token: ""
    });

    const { data } = await this.axios.request<{ result: { songs: Song[] }; code: number; }>({
      url: this.API_ROUTER.SearchSong,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      params: {
        csrf_token: ''
      },
      data: qs.stringify({
        params: encBody.encText,
        encSecKey: encBody.encSecKey,
      }),
    });

    if (!data.code || data.code !== 200) {
      // TODO: display API information
      return { success: false, };
    }

    const { songs } = data?.result;
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
    const { data } = await this.axios.request<Lyrics>({
      url: this.API_ROUTER.SearchLyrics,
      method: 'GET',
      params: { id },
    });

    return data?.lyric;
  }
}
