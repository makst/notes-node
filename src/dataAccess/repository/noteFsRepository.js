import { filter, remove, cloneDeep } from 'lodash';
import { saveNotes, readNotes } from './util/fs';

const getAll = async () => {
    const notes = await readNotes();
    return cloneDeep(notes);
};

const add = async (note) => {
    const allNotes = await getAll();
    const alreadyExists = !!filter(allNotes, ['title', note.title]).length;
    const noTitle = !note.title;

    if (alreadyExists || noTitle) {
        return null;
    }
    allNotes.push(note);
    await saveNotes(allNotes);
    return note;
};

const get = async (specification) => {
    const allNotes = await getAll();
    const note = filter(
        allNotes,
        n => specification.isSatisfiedBy(n),
    )[0] || null;

    return note;
};

const removeNote = async (specification) => {
    const allNotes = await getAll();
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

export { add, get, removeNote as remove, getAll };
