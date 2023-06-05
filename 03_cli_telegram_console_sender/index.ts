#!/usr/bin/env node

import TelegramBot from 'node-telegram-bot-api';
import { program } from "commander";

const TELEGRAM_TOKEN = '6280016824:AAEKj2l7eNe8xVQD4su2Xww-T6EP-KAZ0Ik';
const CHAT_ID = '341620799'; // Run "node index.js start" to get current chat id
// @ts-ignore
process.env["NTBA_FIX_350"] = 1;

const bot = new TelegramBot(TELEGRAM_TOKEN, {polling: true});

const sendMessage = async (chatId: string, message: string) => {
    await bot.sendMessage(chatId, message);

    await process.exit();
}

const sendPhoto = async (chatId: string, path: string) => {
    await bot.sendPhoto(chatId, path);

    await process.exit();
}

const getChatId = async () => {
    bot.onText(/\/start/, async (msg) => {
        const chatId = msg.chat.id;

        await bot.sendMessage(chatId, String(chatId));

        await process.exit();
    });
}

const main = async () => {

    program.command('start')
        .description('Get current chat ID')
        .alias('s')
        .action(async () => {
            await getChatId();
        })

    program.command('message')
        .description('Send message to Telegram Bot')
        .alias('m')
        .argument('<message>', 'message from bot')
        .action(async (message: string) => {
            await sendMessage(CHAT_ID, message);
        })

    program.command('photo')
        .description('Send photo to Telegram Bot')
        .alias('p')
        .argument('<photo>', 'photo from bot')
        .action(async (photo: string) => {
            await sendPhoto(CHAT_ID, photo)
        })

    await program.parseAsync(process.argv);
}

main();