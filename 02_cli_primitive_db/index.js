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
import inquirer from 'inquirer';
import { fileURLToPath } from 'url';
import * as fs from 'fs';
import * as path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FILE_PATH = path.resolve(__dirname, 'db.txt');
const writeFile = (path, data) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => fs.writeFile(path, data, (err) => {
        if (err) {
            return reject(err.message);
        }
        resolve();
    }));
});
const readFile = (path) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => fs.readFile(path, { encoding: 'utf-8' }, (err, data) => {
        if (err) {
            return reject(err.message);
        }
        resolve(data);
    }));
});
const existFile = (path) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => fs.exists(path, (exists) => {
        return resolve(exists);
    }));
});
const jsonParseData = () => __awaiter(void 0, void 0, void 0, function* () {
    const dbData = yield readFile(FILE_PATH);
    return JSON.parse(dbData);
});
const addNewUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    let dataJson = yield jsonParseData();
    dataJson.push(user);
    yield writeFile(FILE_PATH, JSON.stringify(dataJson, null, 4));
});
const helperQuestionBlock = () => __awaiter(void 0, void 0, void 0, function* () {
    let dataJson = yield jsonParseData();
    const { data } = yield inquirer.prompt({
        type: 'confirm',
        name: 'data',
        message: 'Would you to search values in DB?:',
    });
    if (data) {
        console.log(dataJson);
    }
    else {
        return;
    }
    const { user } = yield inquirer.prompt({
        type: 'input',
        name: 'user',
        message: 'Enter users name you wanna find in DB:',
    });
    if (user) {
        const singleUser = dataJson.filter(item => item.username.toLowerCase() === user.toLowerCase());
        if (singleUser.length) {
            singleUser.forEach(user => {
                console.log(`User ${user.username} was found`);
                console.log(JSON.stringify(user));
            });
        }
        else {
            console.log('User not found :(');
        }
    }
});
const mainQuestionBlock = () => __awaiter(void 0, void 0, void 0, function* () {
    const existDbFile = yield existFile(FILE_PATH);
    if (!existDbFile) {
        yield writeFile(FILE_PATH, JSON.stringify([], null, 4));
    }
    const { username } = yield inquirer.prompt({
        type: 'input',
        name: 'username',
        message: 'Enter the users name. To cancel press ENTER:'
    });
    if (!username.length) {
        return yield helperQuestionBlock();
    }
    const { gender } = yield inquirer.prompt({
        type: 'list',
        name: 'gender',
        message: 'Choose your Gender:',
        choices: ['male', 'female']
    });
    const { age } = yield inquirer.prompt({
        type: 'number',
        name: 'age',
        message: 'Enter your age:'
    });
    const newUser = { username, age, gender };
    yield addNewUser(newUser);
    yield mainQuestionBlock();
});
mainQuestionBlock();
