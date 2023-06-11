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
import NodeCache from "node-cache";
import TelegramBot from 'node-telegram-bot-api';
import axios from "axios";
import { ActionButton, ExchangeRates } from "./buttons.js";
const TELEGRAM_TOKEN = ''; // Your tg bot token
const API_LINK_PRIVATBANK = 'https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5';
const API_LINK_MONOBANK = 'https://api.monobank.ua/bank/currency';
const VALUE_KEYS = {
    MONO_BANK: 'MonoBank',
    PRIVAT_BANK: 'PrivatBank',
    UAH_STR: 'UAH',
    EUR_STR: 'EUR',
    USD_STR: 'USD',
    UAH: 980,
    EUR: 978,
    USD: 840
};
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
const myCache = new NodeCache({ stdTTL: 120 });
const sendMessage = (chatId, message, options) => __awaiter(void 0, void 0, void 0, function* () {
    yield bot.sendMessage(chatId, message, options);
});
const getExchangeRatesPrivat = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let exchangeCache = myCache.get(VALUE_KEYS.PRIVAT_BANK);
        if (!exchangeCache) {
            const { data } = yield axios.get(API_LINK_PRIVATBANK);
            exchangeCache = data === null || data === void 0 ? void 0 : data.filter(item => item.ccy === VALUE_KEYS.USD_STR && item.base_ccy === VALUE_KEYS.UAH_STR ||
                item.ccy === VALUE_KEYS.EUR_STR && item.base_ccy === VALUE_KEYS.UAH_STR);
            myCache.mset([
                { key: VALUE_KEYS.PRIVAT_BANK, val: exchangeCache },
            ]);
        }
        return exchangeCache;
    }
    catch (err) {
        throw err;
    }
});
const getExchangeRatesMono = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let exchangeCache = myCache.get(VALUE_KEYS.MONO_BANK);
        if (!exchangeCache) {
            const { data } = yield axios.get(API_LINK_MONOBANK);
            exchangeCache = data === null || data === void 0 ? void 0 : data.filter(item => item.currencyCodeA === VALUE_KEYS.USD && item.currencyCodeB === VALUE_KEYS.UAH ||
                item.currencyCodeA === VALUE_KEYS.EUR && item.currencyCodeB === VALUE_KEYS.UAH);
            myCache.mset([
                { key: VALUE_KEYS.MONO_BANK, val: exchangeCache },
            ]);
        }
        return exchangeCache;
    }
    catch (err) {
        throw err;
    }
});
const toParseFloat = (num) => {
    if (typeof num === 'string') {
        return Number(num).toFixed(2);
    }
    else {
        return num.toFixed(2);
    }
};
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    bot.on('message', (msg) => __awaiter(void 0, void 0, void 0, function* () {
        const chatId = msg.chat.id;
        const msgText = msg.text;
        const privatBankData = yield getExchangeRatesPrivat();
        const monoBankData = yield getExchangeRatesMono();
        let banksData;
        if (privatBankData && monoBankData) {
            banksData = [...privatBankData, ...monoBankData];
        }
        else {
            yield sendMessage(chatId, 'Помилка');
            process.exit();
            return;
        }
        if (msgText === '/start') {
            yield sendMessage(chatId, 'Оберіть дію', ActionButton);
        }
        if (msgText === '/Курси_валют') {
            yield sendMessage(chatId, 'Оберіть курс', ExchangeRates);
        }
        if (msgText === '/USD') {
            const usd = banksData.filter(item => item.ccy === VALUE_KEYS.USD_STR || item.currencyCodeA === VALUE_KEYS.USD);
            const msgUsd = `ПриватБанк: купівля ${toParseFloat(usd[0].buy)}, продаж ${toParseFloat(usd[0].sale)} \n` +
                `МоноБанк: купівля ${toParseFloat(usd[1].rateBuy)}, продаж ${toParseFloat(usd[1].rateSell)}`;
            yield sendMessage(chatId, msgUsd);
        }
        if (msgText === '/EUR') {
            const eur = banksData.filter(item => item.ccy === VALUE_KEYS.EUR_STR || item.currencyCodeA === VALUE_KEYS.EUR);
            const msgUsd = `ПриватБанк: купівля ${toParseFloat(eur[0].buy)}, продаж ${toParseFloat(eur[0].sale)} \n` +
                `МоноБанк: купівля ${toParseFloat(eur[1].rateBuy)}, продаж ${toParseFloat(eur[1].rateSell)}`;
            yield sendMessage(chatId, msgUsd);
        }
    }));
});
main();
