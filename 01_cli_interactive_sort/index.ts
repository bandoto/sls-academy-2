#!/usr/bin/env node

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

interface IPhrase {
    mainQuestion: string;
    howToSortQuestion: string;
    exitPhrase: string;
    closeAnswer: string;
    errorMsg: string;
    errorSort: string;
}

const phraseList: IPhrase = {
    mainQuestion: 'Hello. Enter 10 words or digits deviding them in spaces: ',
    howToSortQuestion: 'How would you like to sort values:\n\n' +
        '1. Sort words alphabetically\n' +
        '2. Show numbers from lesser to greater\n' +
        '3. Show numbers from bigger to smaller\n' +
        '4. Display words in ascending order by number of letters in the word\n' +
        '5. Show only unique words\n' +
        '6. Display only unique values from the set of words and numbers entered by the user\n\n' +
        'Select (1 - 5) and press ENTER: ',
    exitPhrase: 'exit',
    closeAnswer: 'Goodbye! Comeback Again!',
    errorMsg: 'You did not enter numbers or words, try again',
    errorSort: 'method does not exist, try again'
}

const question = (questionItem: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        rl.question(questionItem, (answer: string) => {
            if (answer === phraseList.exitPhrase) {
                onClose();
            } else if (!answer.length) {
                resolve(question(questionItem))
            } else if (answer.length) {
                resolve(answer);
            }
        })
    })
}

const onClose = () => {
    rl.on('close',() => {
        console.log(phraseList.closeAnswer);
    })

    rl.close();
}

const toArray = (str: string) => {
    return str.toLowerCase().split(' ');
}

const toNumbers = (arr: string[]) => {
    return arr.filter(item => Number(item));
}

const toStrings = (arr: string[]) => {
    return arr.filter(item => !Number(item));
}

const toAlphabetically = (arr: string[]) => {
    return toStrings(arr).sort();
}

const toNumbersSort = (arr: string[], multiplier: number) => {
    return toNumbers(arr).sort((a: string, b: string) => {
        return (Number(a) - Number(b)) * multiplier;
    })
}

const toByNumberOfLetters = (arr: string[]) => {
    return toStrings(arr).sort((a, b) => a.length - b.length);
}

const toUniqueString = (arr: string[]) => {
    return toStrings(arr).filter((value, index, self) => self.indexOf(value) === index);
}

const toUniqueValues = (arr: string[]) => {
    return arr.filter((value, index, self) => self.indexOf(value) === index);
}

const main = async () => {
    const str = await question(phraseList.mainQuestion);
    const sortMethod = await question(phraseList.howToSortQuestion);

    const array = toArray(str);

    let result;

    switch (sortMethod) {
        case '1':
            result = toAlphabetically(array)
            break;
        case '2':
            result = toNumbersSort(array, 1)
            break;
        case '3':
            result = toNumbersSort(array, -1)
            break;
        case '4':
            result = toByNumberOfLetters(array)
            break;
        case '5':
            result = toUniqueString(array)
            break;
        case '6':
            result = toUniqueValues(array)
            break;
        default:
            result = `${sortMethod} ${phraseList.errorSort}`
            break;
    }

    if (!result.length) {
        result = phraseList.errorMsg
    }

    console.log(result)

    await main();
}

main();