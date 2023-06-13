#!/usr/bin/env node

import { fileURLToPath } from 'url';
import * as fs from 'fs';
import * as path from 'path';
import {ITransformUser, IUserResponse, IVacation} from "./models";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readFile = async (path: string): Promise<string> => {
    return new Promise((resolve, reject) => fs.readFile(path, {encoding: 'utf-8'}, (err, file) => {
        if (err) {
            return reject(err.message);
        }

        resolve(file);
    }))
}

const writeFile = async (path: any, data: any): Promise<void> => {
    return new Promise((resolve, reject) => fs.writeFile(path, data, (err) => {
        if (err) {
            return reject(err.message)
        }

        resolve();
    }))
}

const toParseJson = async (path: string): Promise<IUserResponse[]> => {
    const dbJson = await readFile(path);

    return JSON.parse(dbJson);
}

const transformData = (data: IUserResponse[]): ITransformUser[] => {
    const transformedDataMap = new Map<string, ITransformUser>();

    data.forEach(user => {
        const userId = user._id;
        const userName = user.user.name;
        const vacation = {
            startDate: user.startDate,
            endDate: user.endDate
        }

        if (transformedDataMap.has(userId)) {
            const existUser = transformedDataMap.get(userId);
            existUser?.vacations.push(vacation)
        } else {
            const newUser: ITransformUser = {
                userId,
                userName,
                vacations: [vacation]
            }

            transformedDataMap.set(userId, newUser);
        }
    })

    return Array.from(transformedDataMap.values());
}

const main = async () => {
    const parsedData = await toParseJson(path.resolve(__dirname, 'db.json'));

    const outputData = transformData(parsedData);

    await writeFile(path.resolve(__dirname, 'dbTransform.json'), JSON.stringify(outputData, null, 2))
}

main();