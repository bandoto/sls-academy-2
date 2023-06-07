export const forecastButton = {
    reply_markup: {
        inline_keyboard: [
            [{ text: 'Forecast', callback_data: 'click' }],
        ],
        one_time_keyboard: true,
    }
};
export const intervalButton = {
    reply_markup: {
        inline_keyboard: [
            [{ text: '3 hours', callback_data: '3' }],
            [{ text: '6 hours', callback_data: '6' }],
        ],
        one_time_keyboard: true,
    }
};
