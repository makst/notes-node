import fs from 'fs';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

const NOTES_LOCATION = `${__dirname}/../storage.json`;

const save = async notes => writeFile(NOTES_LOCATION, JSON.stringify(notes));

const read = async () => {
    const notes = await readFile(NOTES_LOCATION, { encoding: 'utf8' });
    return JSON.parse(notes);
};

export { save, read };
