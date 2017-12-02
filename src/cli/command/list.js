import { noteRepository } from '../../dataAccess/repository';

const getCommandInfo = () => ({
    name: 'list',
    description: 'List all notes',
});

const run = async () => {
    const allNotes = await noteRepository.getAll();
    console.log('Listing all notes.', allNotes);
    return allNotes;
};

export { getCommandInfo, run };
