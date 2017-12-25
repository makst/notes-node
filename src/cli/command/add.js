import { curry } from 'lodash';
import { title as titleOption, body as bodyOption } from './util/option';

const getCommandInfo = () => ({
    name: 'add',
    description: 'Add a new note',
    options: {
        title: titleOption,
        body: bodyOption,
    },
});

const run = async (noteRepository, { title, body }) => {
    console.log('Adding new note. ');

    const note = await noteRepository.add({ title, body });
    if (note) {
        console.log('note has been created', note);
    } else {
        console.log('note was not created');
    }
    return note;
};

export default function makeModule(noteRepository) {
    return {
        getCommandInfo,
        run: curry(run, 2)(noteRepository),
    };
}
