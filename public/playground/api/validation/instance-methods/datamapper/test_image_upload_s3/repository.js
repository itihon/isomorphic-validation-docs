// mock repository
import fs from 'fs';
import { randomBytes } from 'crypto';

const readDbFile = () => {
    const { images } = JSON.parse(fs.readFileSync('db.json'));
    return new Map(Object.entries(images));
}

const repository = readDbFile();

const writeDbFile = () => {
    const images = Object.fromEntries(repository);
    fs.writeFileSync('db.json', JSON.stringify({ images }, undefined, 2));
};

const create = (record) => {
    const id = randomBytes(16).toString('hex');
    repository.set(id, record);

    return new Promise((res) => { 
        writeDbFile();
        res(id);
    });
};

const update = (id, record) => {
    const updatedRecord = { ...repository.get(id), ...record };
    repository.set(id, updatedRecord);

    return new Promise((res) => {
        writeDbFile();
        res(true);
    });
};

export default repository;
export { create, update };

