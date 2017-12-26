import test from 'tape-async';
import td from 'testdouble';
import makeNoteRepository from './noteFsRepository';

function setup() {
    const specification = td.object(['isSatisfiedBy']);
    const noteStore = td.object(['save', 'read']);

    // fixtures
    const note1 = { title: 'note1', body: 'body1' };
    const note2 = { title: 'note2', body: 'body2' };
    const allNotes = [note1, note2];

    return {
        specification, noteStore, note1, note2, allNotes,
    };
}

test('noteFsRepository.get(specification) returns note which satisfies specification', async (assert) => {
    // arrange
    const {
        specification, noteStore, note1, allNotes,
    } = setup();
    const noteFsRepository = makeNoteRepository(noteStore);
    td.when(noteStore.read()).thenResolve(allNotes);
    td.when(specification.isSatisfiedBy(note1)).thenReturn(true);

    // act
    const actualRetrievedNote = await noteFsRepository.get(specification);

    // assert
    assert.deepEqual(actualRetrievedNote, note1);
    assert.end();
});

test('noteFsRepository.get(specification) returns null if neither note satisfies specification', async (assert) => {
    // arrange
    const {
        specification, noteStore, allNotes,
    } = setup();
    const noteFsRepository = makeNoteRepository(noteStore);
    td.when(noteStore.read()).thenResolve(allNotes);
    td.when(specification.isSatisfiedBy(td.matchers.anything())).thenReturn(false);

    // act
    const actualRetrievedNote = await noteFsRepository.get(specification);

    // assert
    assert.equal(actualRetrievedNote, null);
    assert.end();
});

test('noteFsRepository.add(note) returns note if added successfully', async (assert) => {
    // arrange
    const {
        noteStore, note1, note2, allNotes: allNotesBeforeAdding,
    } = setup();
    const noteFsRepository = makeNoteRepository(noteStore);
    td.when(noteStore.read()).thenResolve(allNotesBeforeAdding);

    const newNote = { title: 'newNote', body: 'newBody' };
    const allNotesAfterAdding = [note1, note2, newNote];

    // act
    const actualAddedNote = await noteFsRepository.add(newNote);

    // assert
    assert.doesNotThrow(async () => {
        td.verify(noteStore.save(allNotesAfterAdding));
    }, 'saveNotes is called with all of the old notes + new note');
    assert.equal(actualAddedNote, newNote);
    assert.end();
});

test("noteFsRepository.add(note) doesn't add note if note with the same title exists", async (assert) => {
    // arrange
    const { noteStore, allNotes } = setup();
    const noteFsRepository = makeNoteRepository(noteStore);
    const newNote = { title: 'note1', body: 'newBody' };
    td.when(noteStore.read()).thenResolve(allNotes);

    // act
    const actualAddedNote = await noteFsRepository.add(newNote);

    // assert
    assert.equal(actualAddedNote, null, 'method returns null');
    assert.end();
});

test("noteFsRepository.add(note) doesn't add note if note has no title", async (assert) => {
    // arrange
    const { noteStore, allNotes } = setup();
    const noteFsRepository = makeNoteRepository(noteStore);
    const newNote = { title: null, body: 'newBody' };
    td.when(noteStore.read()).thenResolve(allNotes);

    // act
    const actualAddedNote = await noteFsRepository.add(newNote);

    // assert
    assert.equal(actualAddedNote, null, 'method returns null');
    assert.end();
});

test('noteFsRepository.getAll() returns all notes from note store', async (assert) => {
    // arrange
    const { noteStore, allNotes } = setup();
    const noteFsRepository = makeNoteRepository(noteStore);
    td.when(noteStore.read()).thenResolve(allNotes);

    // act
    const actualAllNotes = await noteFsRepository.getAll();

    // assert
    assert.deepEqual(actualAllNotes, allNotes);
    assert.end();
});

test('noteFsRepository.remove(specification) returns null if there is nothing to remove', async (assert) => {
    // arrange
    const { specification, noteStore, allNotes } = setup();
    const noteFsRepository = makeNoteRepository(noteStore);
    td.when(noteStore.read()).thenResolve(allNotes);
    td.when(specification.isSatisfiedBy(td.matchers.anything())).thenReturn(false);

    // act
    const actualRemovedNote = await noteFsRepository.remove(specification);

    // assert
    assert.equal(actualRemovedNote, null);
    assert.end();
});

test('noteFsRepository.remove(specification) returns removed note if any note satisfies specification', async (assert) => {
    // arrange
    const {
        specification, noteStore, note1, note2, allNotes,
    } = setup();
    const noteFsRepository = makeNoteRepository(noteStore);
    td.when(noteStore.read()).thenResolve(allNotes);
    td.when(specification.isSatisfiedBy(note1)).thenReturn(true);

    // act
    const actualRemovedNote = await noteFsRepository.remove(specification);

    // assert
    assert.doesNotThrow(async () => {
        td.verify(noteStore.save([note2]));
    });
    assert.deepEqual(actualRemovedNote, note1);
    assert.end();
});
