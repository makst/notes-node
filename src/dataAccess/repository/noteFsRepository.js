import { filter, remove, cloneDeep, curry } from 'lodash';

const getAll = async (readNotes) => {
    const notes = await readNotes();
    return cloneDeep(notes);
};

const add = async (readNotes, saveNotes, note) => {
    const allNotes = await readNotes();
    const alreadyExists = !!filter(allNotes, ['title', note.title]).length;
    const noTitle = !note.title;

    if (alreadyExists || noTitle) {
        return null;
    }
    allNotes.push(note);
    await saveNotes(allNotes);
    return note;
};

const get = async (readNotes, specification) => {
    const allNotes = await readNotes();
    const note = filter(
        allNotes,
        n => specification.isSatisfiedBy(n),
    )[0] || null;

    return note;
};

const removeNote = async (readNotes, saveNotes, specification) => {
    const allNotes = await readNotes();
    let removedNote = null;

    remove(allNotes, (note) => {
        const isSatisfied = specification.isSatisfiedBy(note);
        if (isSatisfied) {
            removedNote = note;
        }
        return isSatisfied;
    });
    if (removedNote) {
        await saveNotes(allNotes);
    }
    return removedNote;
};

export default function makeModule(noteStore) {
    return {
        getAll() { return getAll(noteStore.read); },
        add: curry(add, 3)(noteStore.read, noteStore.save),
        get: curry(get, 2)(noteStore.read),
        remove: curry(removeNote, 3)(noteStore.read, noteStore.save),
    };
}
