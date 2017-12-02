import test from 'tape-async';
import proxyquire from 'proxyquire';
import td from 'testdouble';

function setup() {
    const cliOption = {
        title: 'title',
    };

    const noteRepository = td.object(['get']);

    const readCommand = proxyquire('./read', {
        '../option': cliOption,
        '../../dataAccess/repository': {
            noteRepository,
        },
    });

    return { cliOption, noteRepository, readCommand };
}

test('readCommand.getCommandInfo() returns read command info', (assert) => {
    // arrange
    const { cliOption, readCommand } = setup();

    // act
    const cInfo = readCommand.getCommandInfo();

    // assert
    assert.deepEqual(
        cInfo,
        {
            name: 'read',
            description: 'Read a note',
            options: {
                title: cliOption.title,
            },
        },
    );
    assert.end();
});

test('readCommand.run() returns note from underlying data source', async (assert) => {
    // arrange
    const { noteRepository, readCommand } = setup();
    const note = { title: 'last note', body: 'body' };
    td.when(noteRepository.get(td.matchers.anything())).thenResolve(note);

    // act
    const actualResult = await readCommand.run(note);

    // assert
    assert.equal(actualResult, note);
    assert.end();
});
