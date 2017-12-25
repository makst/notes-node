const getCommandInfo = () => ({
    name: 'list',
    description: 'List all notes',
});

const run = async (noteRepository) => {
    const allNotes = await noteRepository.getAll();
    console.log('Listing all notes.', allNotes);
    return allNotes;
};

export default function makeModule(noteRepository) {
    return {
        getCommandInfo,
        run() { return run(noteRepository); },
    };
}
