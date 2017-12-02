import test from 'tape-async';
import proxyquire from 'proxyquire';
import td from 'testdouble';

function setup() {
    const writeFile = td.function();
    const readFile = td.function();
    const fs = {
        writeFile: () => {},
        readFile: () => {},
    };
    const promisify = td.function();
    td.when(promisify(fs.writeFile)).thenReturn(writeFile);
    td.when(promisify(fs.readFile)).thenReturn(readFile);

    const fsUtil = proxyquire('./fs', {
        fs,
        util: { promisify },
    });

    const allNotes = [{ title: 'note1', body: 'body1' }, { title: 'note2', body: 'body2' }];

    return {
        allNotes, writeFile, readFile, fsUtil,
    };
}

test('fsUtil.saveNotes(notes) saves notes to the file', async (assert) => {
    // arrange
    const { allNotes, writeFile, fsUtil } = setup();
    const stringifiedNotes = JSON.stringify(allNotes);

    // act
    await fsUtil.saveNotes(allNotes);

    // assert
    assert.doesNotThrow(() => {
        td.verify(writeFile(td.matchers.contains('storage.json'), stringifiedNotes));
    });

    assert.end();
});

test('fsUtil.readNotes() reads notes from the file', async (assert) => {
    // arrange
    const { allNotes, readFile, fsUtil } = setup();
    const stringifiedNotes = JSON.stringify(allNotes);
    td.when(readFile(td.matchers.contains('storage.json'), { encoding: 'utf8' })).thenResolve(stringifiedNotes);

    // act
    const actualReturnedNotes = await fsUtil.readNotes();

    // assert
    assert.deepEqual(actualReturnedNotes, allNotes);
    assert.end();
});
