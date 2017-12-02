import * as cliOption from '../option';
import { noteRepository } from '../../dataAccess/repository';
import { noteTitleSpecification } from '../../dataAccess/specification';

const getCommandInfo = () => ({
    name: 'read',
    description: 'Read a note',
    options: {
        title: cliOption.title,
    },
});

const run = async ({ title }) => {
    console.log('Reading note...');
    const spec = noteTitleSpecification.create(title);
    const note = await noteRepository.get(spec);
    console.log(`note: ${JSON.stringify(note)}`);
    return note;
};

export { getCommandInfo, run };
