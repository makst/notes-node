import test from 'tape-async';
import proxyquire from 'proxyquire';
import td from 'testdouble';

test('listCommand.getCommandInfo() returns list command info', (assert) => {
    // arrange
    const listCommand = require('./list');

    // act
    const cInfo = listCommand.getCommandInfo();

    // assert
    assert.deepEqual(
        cInfo,
        {
            name: 'list',
            description: 'List all notes',
        },
    );
    assert.end();
});

test('listCommand.run() returns all notes from underlying data source', async (assert) => {
    // arrange
    const noteRepository = td.object(['getAll']);
    const listCommand = proxyquire('./list', {
        '../../dataAccess/repository': {
            noteRepository,
        },
    });
    const allNotes = [{ title: 'note1', body: 'body1' }, { title: 'note2', body: 'body2' }];
    td.when(noteRepository.getAll()).thenResolve(allNotes);

    // act
    const actualResult = await listCommand.run();

    // assert
    assert.equal(actualResult, allNotes);
    assert.end();
});
