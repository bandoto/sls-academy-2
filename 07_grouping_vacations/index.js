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
const readFile = (path) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => fs.readFile(path, { encoding: 'utf-8' }, (err, file) => {
        if (err) {
            return reject(err.message);
        }
        resolve(file);
    }));
});
const writeFile = (path, data) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => fs.writeFile(path, data, (err) => {
        if (err) {
            return reject(err.message);
        }
        resolve();
    }));
});
const toParseJson = (path) => __awaiter(void 0, void 0, void 0, function* () {
    const dbJson = yield readFile(path);
    return JSON.parse(dbJson);
});
const transformData = (data) => {
    const transformedDataMap = new Map();
    data.forEach(user => {
        const userId = user._id;
        const userName = user.user.name;
        const vacation = {
            startDate: user.startDate,
            endDate: user.endDate
        };
        if (transformedDataMap.has(userId)) {
            const existUser = transformedDataMap.get(userId);
            existUser === null || existUser === void 0 ? void 0 : existUser.vacations.push(vacation);
        }
        else {
            const newUser = {
                userId,
                userName,
                vacations: [vacation]
            };
            transformedDataMap.set(userId, newUser);
        }
    });
    return Array.from(transformedDataMap.values());
};
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = yield toParseJson(path.resolve(__dirname, 'db.json'));
    const outputData = transformData(parsedData);
    yield writeFile(path.resolve(__dirname, 'dbTransform.json'), JSON.stringify(outputData, null, 2));
});
main();
