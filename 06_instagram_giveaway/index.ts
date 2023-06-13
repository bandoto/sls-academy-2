#!/usr/bin/env node

import { fileURLToPath } from 'url';
import * as fs from 'fs';
import * as path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readDir = async (path: string): Promise<string[]> => {
    return new Promise((resolve, reject) => fs.readdir(path, {encoding: 'utf-8'}, (err, files) => {
        if (err) {
            return reject(err.message)
        }

        resolve(files)
    }))
}

const readFile = async (path: string): Promise<string[]> => {
    return new Promise((resolve, reject) => fs.readFile(path, {encoding: 'utf-8'}, (err, file) => {
        if (err) {
            return reject(err.message)
        }

        const array = file.toString().split("\n");

        resolve(array);
    }))
}

const uniqueValues = async (arr: string[]): Promise<number> => {
    try {
        const uniqueValues = new Set();

        for (const item of arr) {
            const fileContents = await readFile(path.resolve(__dirname, 'files', item));

            fileContents.forEach(value => {
                uniqueValues.add(value.trim());
            })
        }

        return uniqueValues.size;
    } catch (err) {
        throw err;
    }
}

const existInAllFiles = async (arr: string[]): Promise<{values: number, counts: Map<string, number>}> => {
    try {
        const counts = new Map();
        const values = new Set();

        for (const item of arr) {
            const fileContents = await readFile(path.resolve(__dirname, 'files', item));
            const uniqueValues = new Set(fileContents);

            uniqueValues.forEach(value => {
                const count = counts.get(value) || 0;

                counts.set(value, count + 1);

                if (count + 1 === arr.length) {
                    values.add(value)
                }
            })
        }

        return {
            values: values.size,
            counts: counts
        }

    } catch (err) {
        throw err;
    }
}

const existInAtleastTen = async (arr: Map<string, number>): Promise<number> => {
    let count = 0;

    arr.forEach(fileCount => {
        if (fileCount >= 10) {
            count++;
        }
    });

    return count
}

const main = async () => {
    const start = new Date().getTime();

    const filesNames = await readDir(path.resolve(__dirname, 'files'))

    const uniq = await uniqueValues(filesNames)
    const exist = await existInAllFiles(filesNames)
    const existTen = await existInAtleastTen(exist?.counts!)

    console.log(`unique usernames: ${uniq}`)
    console.log(`usernames in all 20 files: ${exist?.values}`)
    console.log(`usernames in atleast ten: ${existTen}`)

    const end = new Date().getTime();

    console.log(`Elapsed Time : ${end - start}ms`);
}

main();
