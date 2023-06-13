#!/usr/bin/env node

import axios from "axios";

const KEY = 'isDone';
const LINKS = [
    'https://jsonbase.com/sls-team/json-793',
    'https://jsonbase.com/sls-team/json-955',
    'https://jsonbase.com/sls-team/json-231',
    'https://jsonbase.com/sls-team/json-931',
    'https://jsonbase.com/sls-team/json-93',
    'https://jsonbase.com/sls-team/json-342',
    'https://jsonbase.com/sls-team/json-770',
    'https://jsonbase.com/sls-team/json-491',
    'https://jsonbase.com/sls-team/json-281',
    'https://jsonbase.com/sls-team/json-718',
    'https://jsonbase.com/sls-team/json-310',
    'https://jsonbase.com/sls-team/json-806',
    'https://jsonbase.com/sls-team/json-469',
    'https://jsonbase.com/sls-team/json-258',
    'https://jsonbase.com/sls-team/json-516',
    'https://jsonbase.com/sls-team/json-79',
    'https://jsonbase.com/sls-team/json-706',
    'https://jsonbase.com/sls-team/json-521',
    'https://jsonbase.com/sls-team/json-350',
    'https://jsonbase.com/sls-team/json-64'
]

const searchKeyInJson = (json: any, key: string): any => {
    if (typeof json !== 'object' || json === null) {
        return undefined;
    }

    if (json.hasOwnProperty(key)) {
        return json[key];
    }

    for (const prop in json) {
        if (json.hasOwnProperty(prop)) {
            const value = searchKeyInJson(json[prop], key);
            if (value !== undefined) {
                return value;
            }
        }
    }

    return undefined;
}

const getData = async (link: string): Promise<any[] | undefined> => {
    const maxRetries = 3;
    let count = 0;

    while (count < maxRetries) {
        try {
            const { data } = await axios.get<any>(link);

            return data;
        } catch (err) {
            count++;
        }
    }

    return undefined;
}

const main = async () => {
    let trueValues = 0;
    let falseValues = 0;

    for (const link of LINKS) {
        const data = await getData(link);

        const isDoneValue = searchKeyInJson(data, KEY)

        if (isDoneValue !== undefined && isDoneValue === true) {
            console.log(`[Success] ${link}: ${KEY} - True`);
            trueValues++;
        } else if (isDoneValue !== undefined && isDoneValue === false) {
            console.log(`[Success] ${link}: ${KEY} - False`);
            falseValues++;
        } else {
            console.log(`[Fail] ${link}: The endpoint is unavailable`);
        }
    }

    console.log(`Found True values: ${trueValues}`);
    console.log(`Found False values: ${falseValues}`);
}

main();