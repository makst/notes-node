import fs from 'fs';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

const NOTES_LOCATION = `${__dirname}/../storage.json`;

const save = async (notes) => {
    writeFile(NOTES_LOCATION, JSON.stringify(notes));
};

const read = async () => {
    let unparsedNotes = null;

    try {
        unparsedNotes = await readFile(NOTES_LOCATION, { encoding: 'utf8' });
    } catch (e) {
        if (e.code === 'ENOENT') {
            await save([]);
            return [];
        }
        throw e;
    }

    return JSON.parse(unparsedNotes);
};

export { save, read };
