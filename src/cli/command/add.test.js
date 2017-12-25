import test from 'tape-async';
import td from 'testdouble';
import { title, body } from './util/option';
import makeAddCommand from './add';

function setup() {
    const noteRepository = td.object(['add']);
    return { noteRepository };
}

test('add.getCommandInfo() returns add command info', (assert) => {
    // arrange
    const { noteRepository } = setup();
    const add = makeAddCommand(noteRepository);

    // act
    const cInfo = add.getCommandInfo();

    // assert
    assert.deepEqual(
        cInfo,
        {
            name: 'add',
            description: 'Add a new note',
            options: {
                title,
                body,
            },
        },
    );
    assert.end();
});

test('add.run() returns note if adding the note was successful', async (assert) => {
    // arrange
    const { noteRepository } = setup();
    const add = makeAddCommand(noteRepository);
    const note = { title: 'add me', body: 'body' };
    const noteIsAddedResult = { test: 'noteRepository.add result' };
    td.when(noteRepository.add(note)).thenResolve(noteIsAddedResult);

    // act
    const actualResult = await add.run(note);

    // assert
    assert.equal(actualResult, noteIsAddedResult);
    assert.end();
});

test('add.run() returns null if adding the note was not successful', async (assert) => {
    // arrange
    const { noteRepository } = setup();
    const add = makeAddCommand(noteRepository);

    const note = { title: null, body: null };
    const noteIsNotAddedResult = null;
    td.when(noteRepository.add(note)).thenResolve(noteIsNotAddedResult);

    // act
    const actualResult = await add.run(note);

    // assert
    assert.equal(actualResult, noteIsNotAddedResult);
    assert.end();
});
