import test from 'tape-async';
import td from 'testdouble';
import { title } from './util/option';
import makeRemoveCommand from './remove';

function setup() {
    const noteRepository = td.object(['remove']);
    const noteTitleSpecification = td.object(['create']);
    return { noteRepository, noteTitleSpecification };
}

test('removeCommand.getCommandInfo() returns remove command info', (assert) => {
    // arrange
    const { noteRepository, noteTitleSpecification } = setup();
    const remove = makeRemoveCommand(noteRepository, noteTitleSpecification);

    // act
    const cInfo = remove.getCommandInfo();

    // assert
    assert.deepEqual(
        cInfo,
        {
            name: 'remove',
            description: 'Remove a note',
            options: {
                title,
            },
        },
    );
    assert.end();
});

test('removeCommand.run() returns note from underlying data source', async (assert) => {
    // arrange
    const { noteRepository, noteTitleSpecification } = setup();
    const specification = {};
    const note = { title: 'last note', body: 'body' };

    td.when(noteTitleSpecification.create(note.title)).thenReturn(specification);
    td.when(noteRepository.remove(specification)).thenResolve(note);

    const remove = makeRemoveCommand(noteRepository, noteTitleSpecification);

    // act
    const actualResult = await remove.run(note);

    // assert
    assert.equal(actualResult, note);
    assert.end();
});
