#!/usr/bin/env node

import inquirer from 'inquirer';
import { fileURLToPath } from 'url';
import * as fs from 'fs';
import * as path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILE_PATH = path.resolve(__dirname, 'db.txt');

interface IUser {
    username: string;
    gender: string;
    age: number;
}

const writeFile = async (path: any, data: any): Promise<void> => {
    return new Promise((resolve, reject) => fs.writeFile(path, data, (err) => {
        if (err) {
            return reject(err.message)
        }

        resolve();
    }))
}

const readFile = async (path: string): Promise<string> => {
    return new Promise((resolve, reject) => fs.readFile(path, {encoding: 'utf-8'}, (err, data) => {
        if (err) {
            return reject(err.message)
        }

        resolve(data);
    }))
}

const existFile = async (path: any): Promise<boolean> => {
    return new Promise((resolve, reject) => fs.exists(path, (exists) => {
        return resolve(exists)
    }))
}

const jsonParseData = async (): Promise<IUser[]> => {
    const dbData = await readFile(FILE_PATH);

    return JSON.parse(dbData);
}

const addNewUser = async (user: IUser): Promise<void> => {
    let dataJson = await jsonParseData();

    dataJson.push(user);

    await writeFile(FILE_PATH, JSON.stringify(dataJson, null, 4))
}

const helperQuestionBlock = async (): Promise<void> => {
    let dataJson = await jsonParseData();

    const { data } = await inquirer.prompt({
        type: 'confirm',
        name: 'data',
        message: 'Would you to search values in DB?:',
    })

    if (data) {
        console.log(dataJson)
    } else {
        return;
    }

    const { user } = await inquirer.prompt({
        type: 'input',
        name: 'user',
        message: 'Enter users name you wanna find in DB:',
    })

    if (user) {
        const singleUser = dataJson.filter(item => item.username.toLowerCase() === user.toLowerCase());

        if (singleUser.length) {
            singleUser.forEach(user => {
                console.log(`User ${user.username} was found`)
                console.log(JSON.stringify(user))
            })
        } else {
            console.log('User not found :(')
        }
    }
}

const mainQuestionBlock = async (): Promise<void> => {
    const existDbFile = await existFile(FILE_PATH)

    if (!existDbFile) {
        await writeFile(FILE_PATH, JSON.stringify([], null, 4));
    }

    const { username } = await inquirer.prompt({
        type: 'input',
        name: 'username',
        message: 'Enter the users name. To cancel press ENTER:'
    })

    if (!username.length) {
        return await helperQuestionBlock();
    }

    const { gender } = await inquirer.prompt({
        type: 'list',
        name: 'gender',
        message: 'Choose your Gender:',
        choices: ['male', 'female']
    })

    const { age } = await inquirer.prompt({
        type: 'number',
        name: 'age',
        message: 'Enter your age:'
    })

    const newUser: IUser = {username, age, gender};

    await addNewUser(newUser)

    await mainQuestionBlock();
}

mainQuestionBlock();