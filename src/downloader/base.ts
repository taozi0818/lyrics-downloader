import path from 'path';
import * as mm from 'music-metadata';
import fs from "fs";

export interface SongFile {
  _path: string;
  _filename: string;
  name: string;
  artist?: string;
}

export abstract class AbsDownloader {
  abstract downloadLyrics(song: string): Promise<{ success: boolean, lyricsPath?: string; }>
}

type LyricsHandler = (song: SongFile, lyrics: string) => Promise<any>;

export interface BaseDownloaderConfig {
  handlerLyrics?: LyricsHandler;
}

export class BaseDownloader {
  // Set error of media duration. Media will be selected when filename has no artist name. Duration unit: seconds
  public durationError = 5;
  public lyricsExtname = '.lrc';

  protected handlerLyrics: LyricsHandler;

  constructor(opts: { handlerLyrics?: LyricsHandler } = {}) {
    this.handlerLyrics = opts.handlerLyrics || this.defaultLyricsHandler;
  }

  public parseFileName(filename: string): SongFile {
    const [ _name, _artist = '' ] = filename.split('-');

    const extname = path.extname(filename);
    const name = _name.trim();
    const artist = _artist.replace(extname, '').trim();

    return {
      _path: path.resolve(process.cwd(), filename),
      _filename: filename,
      name,
      artist,
    };
  }

  public generateSearchWords(song: SongFile) {
    return song.artist ? `${song.name} ${song.artist}` : song.name;
  }

  public parseMediaFile(path: string) {
    return mm.parseFile(path);
  }

  protected async defaultLyricsHandler(song: SongFile, lyrics: string) {
    if (!lyrics) {
      return;
    }

    const mediaFile = path.parse(song._path);
    const lyricsFileName = mediaFile.name + this.lyricsExtname;
    const filePath = path.resolve(mediaFile.dir, lyricsFileName);

    fs.writeFileSync(filePath, lyrics);

    return {
      path: filePath,
      name: lyricsFileName,
    };
  }
}
