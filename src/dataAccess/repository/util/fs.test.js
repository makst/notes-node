import test from 'tape-async';
import fs from 'fs';
import td from 'testdouble';

function setup() {
    const allNotes = [{ title: 'note1', body: 'body1' }, { title: 'note2', body: 'body2' }];
    const writeFile = td.replace(fs, 'writeFile');
    const readFile = td.replace(fs, 'readFile');

    // it's important to require fsUtil after replacing fs methods
    // in order for fsUtil module to use already replaced methods
    const fsUtil = require('./fs');

    return {
        allNotes, writeFile, readFile, fsUtil,
    };
}

test('fsUtil tests', async (assert) => {
    // arrange
    const {
        allNotes, writeFile, readFile, fsUtil,
    } = setup();
    const stringifiedNotes = JSON.stringify(allNotes);
    // configure 'writeFile' so that it's possible to call it with anything
    td.when(writeFile(td.matchers.anything(), td.matchers.anything())).thenCallback(null);
    td
        .when(readFile(td.matchers.contains('storage.json'), { encoding: 'utf8' }))
        .thenCallback(null, stringifiedNotes);

    // act
    await fsUtil.save(allNotes);
    const actualReturnedNotes = await fsUtil.read();

    // assert
    assert.doesNotThrow(() => {
        td.verify(writeFile(td.matchers.contains('storage.json'), stringifiedNotes, td.matchers.isA(Function)));
    }, 'fsUtil.save(notes) saves notes to the file');
    assert.deepEqual(actualReturnedNotes, allNotes, 'fsUtil.read() reads notes from the file');

    td.reset();
    assert.end();
});
