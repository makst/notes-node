import test from 'tape-async';
import { some } from 'lodash';
import { execute } from '../src/app';

function setup() {
    const validNote = { title: 'valid note title', body: 'body' };
    const invalidNote = { title: null, body: 'body' };

    return { validNote, invalidNote };
}

test('nonexistent command returns null', async (assert) => {
    // act
    const commandResult = await execute('ljlj');

    // assert
    assert.equal(commandResult, null);
    assert.end();
});

test('add, read, list, remove commands with valid note', async (assert) => {
    // arrange
    const { validNote } = setup();

    // act
    const firstAddResult = await execute('add', validNote);
    const secondAddResult = await execute('add', validNote);
    const listResultAfterAdd = await execute('list');

    const readResult = await execute('read', { title: validNote.title });
    const removeResult = await execute('remove', { title: validNote.title });
    const listResultAfterRemove = await execute('list');

    // assert
    assert.deepEqual(firstAddResult, validNote, 'add command with new valid note returns note');
    assert.equal(secondAddResult, null, 'add command returns null if note with the same title exists');
    assert.true(some(listResultAfterAdd, validNote), 'list command contains newly added note');

    assert.deepEqual(readResult, validNote, "read command with new valid note's title returns note");
    assert.deepEqual(removeResult, validNote, "remove command with new valid note's title returns note");
    assert.false(some(listResultAfterRemove, validNote), "list command doesn't contain just removed note");
});

test('add, read, list commands, remove with invalid note', async (assert) => {
    // arrange
    const { invalidNote } = setup();

    // act
    const addResult = await execute('add', invalidNote);
    const listResult = await execute('list');
    const readResult = await execute('read', { title: invalidNote.title });
    const removeResult = await execute('remove', { title: invalidNote.title });

    // assert
    assert.equal(addResult, null, 'add command with invalid note returns null');
    assert.equal(readResult, null, "read command with non existent note's title returns null");
    assert.equal(removeResult, null, "remove command with non existent note's title returns null");

    assert.false(some(listResult, invalidNote), "list command doesn't contain invalid note");
});
