import test from 'tape-async';
import * as defaultCommand from './default';

test('defaultCommand.getCommandInfo() returns null', (assert) => {
    // act
    const cInfo = defaultCommand.getCommandInfo();

    // assert
    assert.equal(cInfo, null);
    assert.end();
});

test('defaultCommand.run() returns null', (assert) => {
    // act
    const actualResult = defaultCommand.run();

    // assert
    assert.equal(actualResult, null);
    assert.end();
});
