import { noteRepository } from '../dataAccess/repository';
import { noteTitleSpecification } from '../dataAccess/specification';

import makeAddCommand from './command/add';
import * as defaultCommand from './command/default';
import makeListCommand from './command/list';
import makeReadCommand from './command/read';
import makeRemoveCommand from './command/remove';

const add = makeAddCommand(noteRepository);
const list = makeListCommand(noteRepository);
const read = makeReadCommand(noteRepository, noteTitleSpecification);
const remove = makeRemoveCommand(noteRepository, noteTitleSpecification);

export { add, list, read, remove, defaultCommand as default };
