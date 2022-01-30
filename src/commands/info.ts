import { Command } from 'commander';
import chalk from 'chalk';
import os from 'os';
import { enAndZh } from '../utils/display';

async function action(argument: string, options, command: Command) {
  const displayItem = [
    [ 'Name', process.env.PACKAGE_NAME ],
    [ 'Version', process.env.VERSION ],
    [ 'Author', 'taoz110818@gmail.com'],
    [ 'System', [ os.platform(), os.type(), os.arch(), ].join(' ') ],
    [ '\nInput `lyrics -h` to display help for command']
  ];

  console.log(chalk.green.green(displayItem.map(i => i.join('\t\t')).join('\n')));
}

/**
 * This command used to display some information of this CLI, then concat with developer to debug.
 * CLI users may be not developers or people has good PC knowledge, so this command is necessary.
 */
const command = new Command()
  .description(`${enAndZh('info.desc')}`)
  .action(action);

export default command;
