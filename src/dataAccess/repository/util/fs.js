import fs from 'fs';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

const saveNotes = async notes => writeFile(`${__dirname}/../storage.json`, JSON.stringify(notes));

const readNotes = async () => {
    const notes = await readFile(`${__dirname}/../storage.json`, { encoding: 'utf8' });
    return JSON.parse(notes);
};

export { saveNotes as save, readNotes as read };
