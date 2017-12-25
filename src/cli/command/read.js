import { curry } from 'lodash';
import { title as titleOption } from './util/option';

const getCommandInfo = () => ({
    name: 'read',
    description: 'Read a note',
    options: {
        title: titleOption,
    },
});

const run = async (noteRepository, noteTitleSpecification, { title }) => {
    console.log('Reading note...');
    const spec = noteTitleSpecification.create(title);
    const note = await noteRepository.get(spec);
    console.log(`note: ${JSON.stringify(note)}`);
    return note;
};

export default function makeModule(noteRepository, noteTitleSpecification) {
    return {
        getCommandInfo,
        run: curry(run, 3)(noteRepository, noteTitleSpecification),
    };
}
