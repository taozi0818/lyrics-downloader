import { Command } from 'commander';
import * as commands from './commands';
import { enAndZh } from './utils/display';

const program = new Command();
const version = process.env.VERSION;
const commandName = '';

enum CommandName {
  Info = 'info',
  Lyrics = 'lyrics',
}

program
  .name(commandName)
  .alias('')
  .version(version)
  .description(`${enAndZh('main.desc')}`)
  .addCommand(commands.lyrics.name(CommandName.Lyrics));

export default program;
