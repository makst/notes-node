import test from 'tape-async';
import proxyquire from 'proxyquire';
import td from 'testdouble';

function setup() {
    const cliOption = {
        title: 'title',
    };

    const noteRepository = td.object(['remove']);

    const removeCommand = proxyquire('./remove', {
        '../option': cliOption,
        '../../dataAccess/repository': {
            noteRepository,
        },
    });

    return { cliOption, noteRepository, removeCommand };
}

test('removeCommand.getCommandInfo() returns remove command info', (assert) => {
    // arrange
    const { cliOption, removeCommand } = setup();

    // act
    const cInfo = removeCommand.getCommandInfo();

    // assert
    assert.deepEqual(
        cInfo,
        {
            name: 'remove',
            description: 'Remove a note',
            options: {
                title: cliOption.title,
            },
        },
    );
    assert.end();
});

test('removeCommand.run() returns note from underlying data source', async (assert) => {
    // arrange
    const { noteRepository, removeCommand } = setup();
    const note = { title: 'last note', body: 'body' };
    td.when(noteRepository.remove(td.matchers.anything())).thenResolve(note);

    // act
    const actualResult = await removeCommand.run(note);

    // assert
    assert.equal(actualResult, note);
    assert.end();
});
