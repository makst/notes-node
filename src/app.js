#!/usr/bin/env node
import yargs from 'yargs';
import { keys } from 'lodash';
import * as commands from './cli';

const execute = async (commandName, argv) => {
    const selectedCommand = commands[commandName] || commands.default;
    return selectedCommand.run(argv);
};

const executeAsScript = async () => {
    keys(commands).forEach((commandName) => {
        const cInfo = commands[commandName].getCommandInfo();
        if (cInfo) {
            yargs.command(cInfo.name, cInfo.description, cInfo.options);
        }
    });
    yargs.help();
    const { argv } = yargs;
    const commandName = argv._[0];
    execute(commandName, argv);
};

export { execute, executeAsScript };
if (!module.parent) {
    executeAsScript();
}
