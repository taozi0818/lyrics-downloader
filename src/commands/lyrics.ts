import { Command } from 'commander';
import { enAndZh } from '../utils/display';
import Downloader from '../downloader';
import fs from 'fs';
import path from 'path';

// Common extension of music file
const audioFileExt = [ '.mp3', '.wma', '.flac', '.spec' ];
const downloader = new Downloader();

async function action(argument: string, options, command: Command) {
  const mediaFiles = listMediaFile();

  await Promise.all(mediaFiles.map(async i => {
    const song = downloader.parseFileName(i.name);
    return downloader.downloadLyrics(song);
  }));
}

const command = new Command()
  .description(`${enAndZh('lyrics.desc_download')}`)
  .storeOptionsAsProperties()
  .action(action);

export default command;

function listMediaFile() {
  const baseDir = process.cwd();
  return fs
    .readdirSync(baseDir, { withFileTypes: true })
    .filter(i => {
      const file = path.parse(i.name);
      return !i.isDirectory()
        && audioFileExt.includes(file.ext.toLowerCase())
        && !fs.existsSync(path.resolve(baseDir, file.name + '.lrc'));
    });
}
