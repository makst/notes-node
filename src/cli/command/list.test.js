import test from 'tape-async';
import td from 'testdouble';
import makeListCommand from './list';

function setup() {
    const noteRepository = td.object(['getAll']);
    return { noteRepository };
}

test('listCommand.getCommandInfo() returns list command info', (assert) => {
    // arrange
    const { noteRepository } = setup();
    const list = makeListCommand(noteRepository);

    // act
    const cInfo = list.getCommandInfo();

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
    const { noteRepository } = setup();
    const list = makeListCommand(noteRepository);

    const allNotes = [{ title: 'note1', body: 'body1' }, { title: 'note2', body: 'body2' }];
    td.when(noteRepository.getAll()).thenResolve(allNotes);

    // act
    const actualResult = await list.run();

    // asser
    assert.equal(actualResult, allNotes);
    assert.end();
});
