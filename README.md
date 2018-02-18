[![Build Status](https://travis-ci.org/makst/notes-node.svg?branch=master)](https://travis-ci.org/makst/notes-node)

About
====
This is a simple demo cli application, which manages the notes, stored locally in a json file.
Application has a pretty straightforward interface:
```
$ notes-node --help
Commands:
  add     Add a new note
  list    List all notes
  read    Read a note
  remove  Remove a note

Options:
  --help  Show help
```

Getting started
====
```
$ git clone git@github.com:makst/notes-node.git
$ cd notes-node
$ npm test
```

Implementation details
====
Main idea behind the creation of this demo app is to test an approach of decoupling [sub]modules by
exporting `makeModule` function in case a module needs an external dependency.

How to get it done without using DI containers? This solution is to make `index.js` a [sub]module's gateway.
So, the only place in the entire [sub]module which can interact with outside [sub]modules is `index.js`.
This approach makes further refactoring and maintanence easier, but the main downside is that it hinders tree-shaking.

Let's take `src/cli/command` submodule and `add` command as an example.
In `index.js` we:
* maintain all of the dependencies;
* create the command by executing command's `makeModule` function with the expected set of dependencies;
* define the interface of the submodule

```javascript
// cli/command/index.js
import { noteRepository } from '../dataAccess/repository';
// ...
import makeAddCommand from './command/add';
// ...
const add = makeAddCommand(noteRepository);
// ...
export { add /* ... */ }
```

You can notice that `add` command requires some dependencies directly:
```javascript
// cli/command/add.js
import { title as titleOption, body as bodyOption } from './util/option';
// ...
export default function makeModule(noteRepository) {
    return {
        getCommandInfo,
        run: curry(run, 2)(noteRepository),
    };
}
```
It's ok as long as this helper is also a part of the submodule `cli/command` and does some utility
function, which is not necessary to be mocked out.
Rule of thumb: make sure that `makeModule` requires only those dependencies, which should be mocked
in unit tests.



