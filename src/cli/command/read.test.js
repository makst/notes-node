import test from 'tape-async';
import td from 'testdouble';
import { title } from './util/option';
import makeReadCommand from './read';

function setup() {
    const noteRepository = td.object(['get']);
    const noteTitleSpecification = td.object(['create']);
    return { noteRepository, noteTitleSpecification };
}

test('readCommand.getCommandInfo() returns read command info', (assert) => {
    // arrange
    const { noteRepository, noteTitleSpecification } = setup();
    const read = makeReadCommand(noteRepository, noteTitleSpecification);

    // act
    const cInfo = read.getCommandInfo();

    // assert
    assert.deepEqual(
        cInfo,
        {
            name: 'read',
            description: 'Read a note',
            options: {
                title,
            },
        },
    );
    assert.end();
});

test('readCommand.run() returns note from underlying data source', async (assert) => {
    // arrange
    const { noteRepository, noteTitleSpecification } = setup();

    const specification = {};
    const note = { title: 'last note', body: 'body' };

    td.when(noteTitleSpecification.create(note.title)).thenReturn(specification);
    td.when(noteRepository.get(specification)).thenResolve(note);

    const read = makeReadCommand(noteRepository, noteTitleSpecification);

    // act
    const actualResult = await read.run(note);

    // assert
    assert.equal(actualResult, note);
    assert.end();
});
