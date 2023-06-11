#!/usr/bin/env node

import NodeCache from "node-cache";
import TelegramBot from 'node-telegram-bot-api';
import axios from "axios";
import { ActionButton, ExchangeRates } from "./buttons.js";

const TELEGRAM_TOKEN = ''; // Your tg bot token
const API_LINK_PRIVATBANK = 'https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5'
const API_LINK_MONOBANK = 'https://api.monobank.ua/bank/currency'
const VALUE_KEYS = {
    MONO_BANK: 'MonoBank',
    PRIVAT_BANK: 'PrivatBank',
    UAH_STR: 'UAH',
    EUR_STR: 'EUR',
    USD_STR: 'USD',
    UAH: 980,
    EUR: 978,
    USD: 840
}

const bot = new TelegramBot(TELEGRAM_TOKEN, {polling: true});
const myCache = new NodeCache({ stdTTL: 120 });

interface IRatePrivat {
    ccy: string
    base_ccy: string
    buy: string
    sale: string
}

interface IRateMono {
    currencyCodeA: number,
    currencyCodeB: number,
    date: number,
    rateSell: number,
    rateBuy: number,
    rateCross: number
}

type IBanks = IRateMono & IRatePrivat;

const sendMessage = async (chatId: number, message: string, options?: {}): Promise<void> => {
    await bot.sendMessage(chatId, message, options);
}

const getExchangeRatesPrivat = async (): Promise<IRatePrivat[]> => {
    try  {
        let exchangeCache: IRatePrivat[] | undefined = myCache.get(VALUE_KEYS.PRIVAT_BANK);

        if (!exchangeCache) {
            const { data } = await axios.get<IRatePrivat[]>(API_LINK_PRIVATBANK);

            exchangeCache = data?.filter(item => item.ccy === VALUE_KEYS.USD_STR && item.base_ccy === VALUE_KEYS.UAH_STR ||
                                                 item.ccy === VALUE_KEYS.EUR_STR && item.base_ccy === VALUE_KEYS.UAH_STR);

            myCache.mset([
                {key: VALUE_KEYS.PRIVAT_BANK, val: exchangeCache},
            ])
        }

        return exchangeCache;

    } catch (err) {
        throw err;
    }
}

const getExchangeRatesMono = async (): Promise<IRateMono[]> => {
    try  {
        let exchangeCache: IRateMono[] | undefined = myCache.get(VALUE_KEYS.MONO_BANK);

        if (!exchangeCache) {
            const { data } = await axios.get<IRateMono[]>(API_LINK_MONOBANK);

            exchangeCache = data?.filter(item => item.currencyCodeA === VALUE_KEYS.USD && item.currencyCodeB === VALUE_KEYS.UAH ||
                                                 item.currencyCodeA === VALUE_KEYS.EUR && item.currencyCodeB === VALUE_KEYS.UAH);

            myCache.mset([
                {key: VALUE_KEYS.MONO_BANK, val: exchangeCache},
            ])
        }

        return exchangeCache;

    } catch (err) {
        throw err;
    }
}

const toParseFloat = (num: number | string) => {
    if (typeof num === 'string') {
        return Number(num).toFixed(2);
    } else {
        return num.toFixed(2);
    }
}

const main = async () => {
    bot.on('message', async (msg) => {
        const chatId = msg.chat.id;
        const msgText = msg.text;

        const privatBankData = await getExchangeRatesPrivat();
        const monoBankData = await getExchangeRatesMono();

        let banksData;

        if (privatBankData && monoBankData) {
            banksData = [...privatBankData, ...monoBankData];
        } else {
            await sendMessage(chatId, 'Помилка');

            process.exit();

            return;
        }

        if (msgText === '/start') {
            await sendMessage(chatId,'Оберіть дію', ActionButton);
        }

        if (msgText === '/Курси_валют') {
            await sendMessage(chatId,'Оберіть курс', ExchangeRates);
        }

        if (msgText === '/USD') {
            const usd: IBanks = banksData.filter(item => item.ccy === VALUE_KEYS.USD_STR || item.currencyCodeA === VALUE_KEYS.USD);

            const msgUsd = `ПриватБанк: купівля ${toParseFloat(usd[0].buy)}, продаж ${toParseFloat(usd[0].sale)} \n` +
                           `МоноБанк: купівля ${toParseFloat(usd[1].rateBuy)}, продаж ${toParseFloat(usd[1].rateSell)}`;

            await sendMessage(chatId, msgUsd);
        }

        if (msgText === '/EUR') {
            const eur: IBanks  = banksData.filter(item => item.ccy === VALUE_KEYS.EUR_STR || item.currencyCodeA === VALUE_KEYS.EUR);

            const msgUsd = `ПриватБанк: купівля ${toParseFloat(eur[0].buy)}, продаж ${toParseFloat(eur[0].sale)} \n` +
                           `МоноБанк: купівля ${toParseFloat(eur[1].rateBuy)}, продаж ${toParseFloat(eur[1].rateSell)}`;

            await sendMessage(chatId, msgUsd);
        }
    });
}

main();
