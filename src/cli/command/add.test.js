import test from 'tape-async';
import proxyquire from 'proxyquire';
import td from 'testdouble';

function setup() {
    const cliOption = {
        title: 'title',
        body: 'body',
    };

    const noteRepository = td.object(['add']);

    const add = proxyquire('./add', {
        '../option': cliOption,
        '../../dataAccess/repository': {
            noteRepository,
        },
    });

    return { cliOption, noteRepository, add };
}

test('add.getCommandInfo() returns add command info', (assert) => {
    // arrange
    const { cliOption, add } = setup();

    // act
    const cInfo = add.getCommandInfo();

    // assert
    assert.deepEqual(
        cInfo,
        {
            name: 'add',
            description: 'Add a new note',
            options: {
                title: cliOption.title,
                body: cliOption.body,
            },
        },
    );
    assert.end();
});

test('add.run() returns note if adding the note was successful', async (assert) => {
    // arrange
    const { noteRepository, add } = setup();
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
    const { noteRepository, add } = setup();
    const note = { title: null, body: null };
    const noteIsNotAddedResult = null;
    td.when(noteRepository.add(note)).thenResolve(noteIsNotAddedResult);

    // act
    const actualResult = await add.run(note);

    // assert
    assert.equal(actualResult, noteIsNotAddedResult);
    assert.end();
});
