import * as cliOption from '../option';
import { noteRepository } from '../../dataAccess/repository';

const getCommandInfo = () => ({
    name: 'add',
    description: 'Add a new note',
    options: {
        title: cliOption.title,
        body: cliOption.body,
    },
});

const run = async ({ title, body }) => {
    console.log('Adding new note. ');

    const note = await noteRepository.add({ title, body });
    if (note) {
        console.log('note has been created', note);
    } else {
        console.log('note was not created');
    }
    return note;
};

export { getCommandInfo, run };
