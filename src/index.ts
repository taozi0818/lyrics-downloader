import { Command } from 'commander';
import * as commands from './commands';
import { enAndZh } from './utils/display';

const program = new Command();
const version = process.env.VERSION;
const commandName = 'lyrics-downloader';

enum CommandName {
  Info = 'info',
  Download = 'download',
}

program
  .name(commandName)
  .alias('lyrics-dl')
  .alias('lyrics')
  .version(version)
  .description(`${enAndZh('main.desc')}`)
  .addCommand(commands.info.name(CommandName.Info))
  .addCommand(commands.download.name(CommandName.Download));

export default program;
