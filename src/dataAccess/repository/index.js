import makeNoteRepository from './noteFsRepository';
import * as noteStore from './util/fs';

const noteRepository = makeNoteRepository(noteStore);

export { noteRepository }; // eslint-disable-line
