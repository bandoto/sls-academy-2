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
import axios from "axios";
import { forecastButton, intervalButton } from "./buttons.js";
const TELEGRAM_TOKEN = '';
const API_KEY = '';
const API_LINK = 'https://api.openweathermap.org/data/2.5/forecast';
const CITY = 'Poltava';
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
const sendMessage = (chatId, message, options) => __awaiter(void 0, void 0, void 0, function* () {
    yield bot.sendMessage(chatId, message, options);
});
const getWeather = (city) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = yield axios.get(`${API_LINK}?q=${city},UA&lang=uk&units=metric&appid=${API_KEY}`);
        return {
            weatherInfo: data.list.map(transformWeatherData),
            city: data.city.name
        };
    }
    catch (err) {
        throw (err);
    }
});
const transformWeatherData = (weather) => {
    const weatherDescription = weather.weather.map(w => w.description);
    return {
        date: new Date(weather.dt * 1000).toLocaleString('uk-UA', { day: 'numeric', weekday: 'long', month: 'long', year: 'numeric' }),
        time: new Date(weather.dt * 1000).getHours(),
        temp: Math.floor(weather.main.temp),
        tempFeels: Math.floor(weather.main.feels_like),
        description: weatherDescription
    };
};
const collectMessage = (city, interval) => __awaiter(void 0, void 0, void 0, function* () {
    const weather = yield getWeather(city);
    const intervalData = weather.weatherInfo.filter(item => item.time % Number(interval) === 0);
    let weatherText = `Погода у місті ${weather.city}:\n`;
    let weatherPrevDate;
    intervalData.forEach(item => {
        if (item.date === weatherPrevDate) {
            weatherText += `\n${item.time}:00 ${item.temp}°C, відчувається як ${item.tempFeels}°C, ${item.description}\n`;
        }
        else {
            weatherText += `\n\n${item.date}\n\n${item.time}:00 ${item.temp}°C, відчувається як ${item.tempFeels}°C, ${item.description}\n`;
        }
        weatherPrevDate = item.date;
    });
    const weatherMessage = weatherText;
    return weatherMessage;
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    bot.onText(/\/start/, (msg) => __awaiter(void 0, void 0, void 0, function* () {
        const chatId = msg.chat.id;
        yield sendMessage(chatId, 'Для перегляду погоди натистіть кнопку', forecastButton);
    }));
    bot.on('callback_query', (btn) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const chatId = (_a = btn.message) === null || _a === void 0 ? void 0 : _a.chat.id;
        if (!chatId)
            return;
        if (btn.data === 'click') {
            yield sendMessage(chatId, 'Виберіть інтервал', intervalButton);
        }
        else if (btn.data === '3' || btn.data === '6') {
            const msg = yield collectMessage(CITY, btn.data);
            yield sendMessage(chatId, msg);
        }
    }));
});
main();
