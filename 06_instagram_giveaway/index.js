#!/usr/bin/env node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { fileURLToPath } from 'url';
import * as fs from 'fs';
import * as path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const readDir = (path) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => fs.readdir(path, { encoding: 'utf-8' }, (err, files) => {
        if (err) {
            return reject(err.message);
        }
        resolve(files);
    }));
});
const readFile = (path) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => fs.readFile(path, { encoding: 'utf-8' }, (err, file) => {
        if (err) {
            return reject(err.message);
        }
        const array = file.toString().split("\n");
        resolve(array);
    }));
});
const uniqueValues = (arr) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uniqueValues = new Set();
        for (const item of arr) {
            const fileContents = yield readFile(path.resolve(__dirname, 'files', item));
            fileContents.forEach(value => {
                uniqueValues.add(value.trim());
            });
        }
        return uniqueValues.size;
    }
    catch (err) {
        throw err;
    }
});
const existInAllFiles = (arr) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const counts = new Map();
        const values = new Set();
        for (const item of arr) {
            const fileContents = yield readFile(path.resolve(__dirname, 'files', item));
            const uniqueValues = new Set(fileContents);
            uniqueValues.forEach(value => {
                const count = counts.get(value) || 0;
                counts.set(value, count + 1);
                if (count + 1 === arr.length) {
                    values.add(value);
                }
            });
        }
        return {
            values: values.size,
            counts: counts
        };
    }
    catch (err) {
        throw err;
    }
});
const existInAtleastTen = (arr) => __awaiter(void 0, void 0, void 0, function* () {
    let count = 0;
    arr.forEach(fileCount => {
        if (fileCount >= 10) {
            count++;
        }
    });
    return count;
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const start = new Date().getTime();
    const filesNames = yield readDir(path.resolve(__dirname, 'files'));
    const uniq = yield uniqueValues(filesNames);
    const exist = yield existInAllFiles(filesNames);
    const existTen = yield existInAtleastTen(exist === null || exist === void 0 ? void 0 : exist.counts);
    console.log(`unique usernames: ${uniq}`);
    console.log(`usernames in all 20 files ${exist === null || exist === void 0 ? void 0 : exist.values}`);
    console.log(`usernames in atleast ten: ${existTen}`);
    const end = new Date().getTime();
    console.log(`Elapsed Time : ${end - start}ms`);
});
main();
