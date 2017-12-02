import test from 'tape-async';
import noteTitleSpecification from './noteTitleSpecification';

test('noteTitleSpecification.create(title) returns specification object with isSatisfiedBy method', (assert) => {
    // act
    const specification = noteTitleSpecification.create();

    // assert
    assert.equal(typeof (specification), 'object');
    assert.equal(typeof (specification.isSatisfiedBy), 'function');
    assert.equal(specification.isSatisfiedBy.length, 1, 'isSatisfiedBy accepts one argument');
    assert.end();
});

test("specification.isSatisfied(note) returns true if note's title matches saved one", (assert) => {
    // arrange
    const testNote = {
        title: 'test title',
    };

    // act
    const specification = noteTitleSpecification.create('test title');

    // assert
    assert.true(specification.isSatisfiedBy(testNote));
    assert.end();
});

test("specification.isSatisfied(note) returns false if note's title doesn't match saved one", (assert) => {
    // arrange
    const testNote = {
        title: 'wrong title',
    };

    // act
    const specification = noteTitleSpecification.create('test title');

    // assert
    assert.false(specification.isSatisfiedBy(testNote));
    assert.end();
});
