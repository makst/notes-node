import test from 'tape-async';
import fs from 'fs';
import td from 'testdouble';

function setup() {
    const allNotes = [{ title: 'note1', body: 'body1' }, { title: 'note2', body: 'body2' }];
    const writeFile = td.replace(fs, 'writeFile');
    const readFile = td.replace(fs, 'readFile');
    const fsUtil = require('./fs');

    return {
        allNotes, writeFile, readFile, fsUtil,
    };
}

function restore() {
    delete require.cache[require.resolve('./fs')];
    td.reset();
}

test('fsUtil.save(notes) saves notes to the file', async (assert) => {
    // arrange
    const { allNotes, writeFile, fsUtil } = setup();
    const stringifiedNotes = JSON.stringify(allNotes);
    // configure 'writeFile' so that it's possible to call it with anything
    td.when(writeFile(td.matchers.anything(), td.matchers.anything())).thenCallback(null);

    // act
    await fsUtil.save(allNotes);

    // assert
    assert.doesNotThrow(() => {
        td.verify(writeFile(td.matchers.contains('storage.json'), stringifiedNotes, td.matchers.isA(Function)));
    });

    restore();
    assert.end();
});

test('fsUtil.read() reads notes from the file', async (assert) => {
    // arrange
    const { allNotes, readFile, fsUtil } = setup();
    const stringifiedNotes = JSON.stringify(allNotes);
    td.when(readFile(td.matchers.contains('storage.json'), { encoding: 'utf8' }))
        .thenCallback(null, stringifiedNotes);

    // act
    const actualReturnedNotes = await fsUtil.read();

    // assert
    assert.deepEqual(actualReturnedNotes, allNotes);

    restore();
    assert.end();
});

test('fsUtil.read() creates new storage file and returns empty array if a file did not exist before', async (assert) => {
    // arrange
    const { readFile, fsUtil } = setup();
    td.when(readFile(td.matchers.contains('storage.json'), { encoding: 'utf8' }))
        .thenCallback({ code: 'ENOENT' });

    // act
    const actualReturnedNotes = await fsUtil.read();

    // assert
    assert.deepEqual(actualReturnedNotes, []);

    restore();
    assert.end();
});

test('fsUtil.read() rethrows unknown read storage file error', async (assert) => {
    // arrange
    assert.plan(1);
    const { readFile, fsUtil } = setup();
    const unknownError = new Error('unknown');
    td.when(readFile(td.matchers.contains('storage.json'), { encoding: 'utf8' }))
        .thenCallback(unknownError);

    // act
    try {
        await fsUtil.read();
    } catch (e) {
        assert.equal(e, unknownError, 'error is rethrown');
    }
    restore();
    assert.end();
});
