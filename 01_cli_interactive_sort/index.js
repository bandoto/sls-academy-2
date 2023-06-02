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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var phraseList = {
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
};
var question = function (questionItem) {
    return new Promise(function (resolve, reject) {
        rl.question(questionItem, function (answer) {
            if (answer === phraseList.exitPhrase) {
                onClose();
            }
            else if (!answer.length) {
                resolve(question(questionItem));
            }
            else if (answer.length) {
                resolve(answer);
            }
        });
    });
};
var onClose = function () {
    rl.on('close', function () {
        console.log(phraseList.closeAnswer);
    });
    rl.close();
};
var toArray = function (str) {
    return str.toLowerCase().split(' ');
};
var toNumbers = function (arr) {
    return arr.filter(function (item) { return Number(item); });
};
var toStrings = function (arr) {
    return arr.filter(function (item) { return !Number(item); });
};
var toAlphabetically = function (arr) {
    return toStrings(arr).sort();
};
var toNumbersSort = function (arr, multiplier) {
    return toNumbers(arr).sort(function (a, b) {
        return (Number(a) - Number(b)) * multiplier;
    });
};
var toByNumberOfLetters = function (arr) {
    return toStrings(arr).sort(function (a, b) { return a.length - b.length; });
};
var toUniqueString = function (arr) {
    return toStrings(arr).filter(function (value, index, self) { return self.indexOf(value) === index; });
};
var toUniqueValues = function (arr) {
    return arr.filter(function (value, index, self) { return self.indexOf(value) === index; });
};
var main = function () { return __awaiter(_this, void 0, void 0, function () {
    var str, sortMethod, array, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, question(phraseList.mainQuestion)];
            case 1:
                str = _a.sent();
                return [4 /*yield*/, question(phraseList.howToSortQuestion)];
            case 2:
                sortMethod = _a.sent();
                array = toArray(str);
                switch (sortMethod) {
                    case '1':
                        result = toAlphabetically(array);
                        break;
                    case '2':
                        result = toNumbersSort(array, 1);
                        break;
                    case '3':
                        result = toNumbersSort(array, -1);
                        break;
                    case '4':
                        result = toByNumberOfLetters(array);
                        break;
                    case '5':
                        result = toUniqueString(array);
                        break;
                    case '6':
                        result = toUniqueValues(array);
                        break;
                    default:
                        result = "".concat(sortMethod, " ").concat(phraseList.errorSort);
                        break;
                }
                if (!result.length) {
                    result = phraseList.errorMsg;
                }
                console.log(result);
                return [4 /*yield*/, main()];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
main();
