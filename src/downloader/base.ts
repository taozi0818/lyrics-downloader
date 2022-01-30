import path from 'path';
import * as mm from 'music-metadata';

export interface SongFile {
  _path: string;
  name: string;
  artist?: string;
}

export abstract class AbsDownloader {
  abstract downloadLyrics(song: SongFile): Promise<{ success: boolean, lyricsPath?: string; }>
}

type LyricsHandler = (song: SongFile, lyrics: string) => Promise<any>;

export interface BaseDownloaderConfig {
  handlerLyrics: LyricsHandler;
}

export class BaseDownloader {
  // Set error of media duration. Media will be selected when filename has no artist name. Duration unit: seconds
  public durationError = 5;
  public extname = '.lrc';

  protected handlerLyrics: LyricsHandler;

  constructor(opts?: { handlerLyrics: LyricsHandler }) {}

  public parseFileName(filename: string): SongFile {
    const [ _name, _artist ] = filename.split('-');

    const name = _name.trim();
    const artist = _artist.trim();

    return {
      _path: path.resolve(process.cwd(), name),
      name,
      artist,
    };
  }

  public parseMediaFile(path: string) {
    return mm.parseFile(path);
  }
}
