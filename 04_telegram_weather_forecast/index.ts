#!/usr/bin/env node

import TelegramBot from 'node-telegram-bot-api';
import axios from "axios";
import {IResponse, IWeatherResponse, IWeatherInfo} from "./models";
import {forecastButton, intervalButton} from "./buttons.js";

const TELEGRAM_TOKEN = '';
const API_KEY = '';
const API_LINK = 'https://api.openweathermap.org/data/2.5/forecast'
const CITY = 'Poltava'

const bot = new TelegramBot(TELEGRAM_TOKEN, {polling: true});

const sendMessage = async (chatId: number, message: string, options?: {}): Promise<void> => {
    await bot.sendMessage(chatId, message, options);
}

const getWeather = async (city: string): Promise<IWeatherResponse> => {
    try  {
        const { data } = await axios.get<IResponse>(`${API_LINK}?q=${city},UA&lang=uk&units=metric&appid=${API_KEY}`);

        return {
            weatherInfo: data.list.map(transformWeatherData),
            city: data.city.name
        }

    } catch (err) {
        throw(err);
    }
}

const transformWeatherData = (weather): IWeatherInfo => {
    const weatherDescription = weather.weather.map(w => w.description);

    return {
        date: new Date(weather.dt * 1000).toLocaleString('uk-UA', { day: 'numeric', weekday: 'long', month: 'long', year: 'numeric' }),
        time: new Date(weather.dt * 1000).getHours(),
        temp: Math.floor(weather.main.temp),
        tempFeels: Math.floor(weather.main.feels_like),
        description: weatherDescription
    }
}

const collectMessage = async (city: string, interval: string): Promise<string> => {
    const weather = await getWeather(city);

    const intervalData = weather.weatherInfo.filter(item => item.time % Number(interval) === 0)

    let weatherText = `Погода у місті ${weather.city}:\n`

    let weatherPrevDate;

    intervalData.forEach(item => {
        if (item.date === weatherPrevDate) {
            weatherText += `\n${item.time}:00 ${item.temp}°C, відчувається як ${item.tempFeels}°C, ${item.description}\n`;
        } else {
            weatherText += `\n\n${item.date}\n\n${item.time}:00 ${item.temp}°C, відчувається як ${item.tempFeels}°C, ${item.description}\n`;
        }

        weatherPrevDate = item.date
    })

    const weatherMessage = weatherText

    return weatherMessage;
}

const main = async (): Promise<void> => {
    bot.onText(/\/start/, async (msg) => {
        const chatId = msg.chat.id;

        await sendMessage(chatId,'Для перегляду погоди натистіть кнопку', forecastButton);
    });

    bot.on('callback_query', async (btn) => {
        const chatId = btn.message?.chat.id;

        if (!chatId) return;

        if (btn.data === 'click') {
            await sendMessage(chatId,'Виберіть інтервал', intervalButton)

        } else if (btn.data === '3' || btn.data === '6') {
            const msg = await collectMessage(CITY, btn.data);

            await sendMessage(chatId, msg);
        }
    });
}

main();