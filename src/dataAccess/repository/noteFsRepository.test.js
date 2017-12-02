import test from 'tape-async';
import proxyquire from 'proxyquire';
import td from 'testdouble';

function setup() {
    const specification = td.object(['isSatisfiedBy']);
    const fsUtil = td.object(['saveNotes', 'readNotes']);

    const noteFsRepository = proxyquire('./noteFsRepository', {
        './util/fs': fsUtil,
    });

    // fixtures
    const note1 = { title: 'note1', body: 'body1' };
    const note2 = { title: 'note2', body: 'body2' };
    const allNotes = [note1, note2];

    return {
        specification, fsUtil, noteFsRepository, note1, note2, allNotes,
    };
}

test('noteFsRepository.get(specification) returns note which satisfies specification', async (assert) => {
    // arrange
    const {
        specification, fsUtil, noteFsRepository, note1, allNotes,
    } = setup();
    td.when(fsUtil.readNotes()).thenResolve(allNotes);
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
        specification, fsUtil, noteFsRepository, allNotes,
    } = setup();
    td.when(fsUtil.readNotes()).thenResolve(allNotes);
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
        fsUtil, noteFsRepository, note1, note2, allNotes: allNotesBeforeAdding,
    } = setup();
    const newNote = { title: 'newNote', body: 'newBody' };
    const allNotesAfterAdding = [note1, note2, newNote];
    td.when(fsUtil.readNotes()).thenResolve(allNotesBeforeAdding);

    // act
    const actualAddedNote = await noteFsRepository.add(newNote);

    // assert
    assert.doesNotThrow(async () => {
        td.verify(fsUtil.saveNotes(allNotesAfterAdding));
    }, 'saveNotes is called with all of the old notes + new note');
    assert.equal(actualAddedNote, newNote);
    assert.end();
});

test("noteFsRepository.add(note) doesn't add note if note with the same title exists", async (assert) => {
    // arrange
    const { fsUtil, noteFsRepository, allNotes } = setup();
    const newNote = { title: 'note1', body: 'newBody' };
    td.when(fsUtil.readNotes()).thenResolve(allNotes);

    // act
    const actualAddedNote = await noteFsRepository.add(newNote);

    // assert
    assert.equal(actualAddedNote, null, 'method returns null');
    assert.end();
});

test("noteFsRepository.add(note) doesn't add note if note has no title", async (assert) => {
    // arrange
    const { fsUtil, noteFsRepository, allNotes } = setup();
    const newNote = { title: null, body: 'newBody' };
    td.when(fsUtil.readNotes()).thenResolve(allNotes);

    // act
    const actualAddedNote = await noteFsRepository.add(newNote);

    // assert
    assert.equal(actualAddedNote, null, 'method returns null');
    assert.end();
});

test('noteFsRepository.getAll() returns all notes using from fs util', async (assert) => {
    // arrange
    const { fsUtil, noteFsRepository, allNotes } = setup();
    td.when(fsUtil.readNotes()).thenResolve(allNotes);

    // act
    const actualAllNotes = await noteFsRepository.getAll();

    // assert
    assert.deepEqual(actualAllNotes, allNotes);
    assert.end();
});

test('noteFsRepository.remove(specification) returns null if there is nothing to remove', async (assert) => {
    // arrange
    const {
        specification, fsUtil, noteFsRepository, allNotes,
    } = setup();
    td.when(fsUtil.readNotes()).thenResolve(allNotes);
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
        specification, fsUtil, noteFsRepository, note1, note2, allNotes,
    } = setup();
    td.when(fsUtil.readNotes()).thenResolve(allNotes);
    td.when(specification.isSatisfiedBy(note1)).thenReturn(true);

    // act
    const actualRemovedNote = await noteFsRepository.remove(specification);

    // assert
    assert.doesNotThrow(async () => {
        td.verify(fsUtil.saveNotes([note2]));
    });
    assert.deepEqual(actualRemovedNote, note1);
    assert.end();
});
