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
import TelegramBot from 'node-telegram-bot-api';
import { program } from "commander";
const TELEGRAM_TOKEN = '6280016824:AAEKj2l7eNe8xVQD4su2Xww-T6EP-KAZ0Ik';
const CHAT_ID = '341620799'; // Run "node index.js start" to get current chat id
// @ts-ignore
process.env["NTBA_FIX_350"] = 1;
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
const sendMessage = (chatId, message) => __awaiter(void 0, void 0, void 0, function* () {
    yield bot.sendMessage(chatId, message);
    yield process.exit();
});
const sendPhoto = (chatId, path) => __awaiter(void 0, void 0, void 0, function* () {
    yield bot.sendPhoto(chatId, path);
    yield process.exit();
});
const getChatId = () => __awaiter(void 0, void 0, void 0, function* () {
    bot.onText(/\/start/, (msg) => __awaiter(void 0, void 0, void 0, function* () {
        const chatId = msg.chat.id;
        yield bot.sendMessage(chatId, String(chatId));
        yield process.exit();
    }));
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    program.command('start')
        .description('Get current chat ID')
        .alias('s')
        .action(() => __awaiter(void 0, void 0, void 0, function* () {
        yield getChatId();
    }));
    program.command('message')
        .description('Send message to Telegram Bot')
        .alias('m')
        .argument('<message>', 'message from bot')
        .action((message) => __awaiter(void 0, void 0, void 0, function* () {
        yield sendMessage(CHAT_ID, message);
    }));
    program.command('photo')
        .description('Send photo to Telegram Bot')
        .alias('p')
        .argument('<photo>', 'photo from bot')
        .action((photo) => __awaiter(void 0, void 0, void 0, function* () {
        yield sendPhoto(CHAT_ID, photo);
    }));
    yield program.parseAsync(process.argv);
});
main();
