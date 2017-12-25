import { curry } from 'lodash';
import { title as titleOption } from './util/option';

const getCommandInfo = () => ({
    name: 'remove',
    description: 'Remove a note',
    options: {
        title: titleOption,
    },
});

const run = async (noteRepository, noteTitleSpecification, { title }) => {
    console.log('Removing note.');
    const spec = noteTitleSpecification.create(title);
    const note = await noteRepository.remove(spec);
    console.log(`note: ${JSON.stringify(note)}`);
    return note;
};

export default function makeModule(noteRepository, noteTitleSpecification) {
    return {
        getCommandInfo,
        run: curry(run, 3)(noteRepository, noteTitleSpecification),
    };
}
