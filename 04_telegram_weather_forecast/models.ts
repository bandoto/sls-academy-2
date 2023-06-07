export interface IResponse {
    cod: string
    message: number
    cnt: number
    list: IList[]
    city: ICity
}

export interface IWeatherInfo {
    date: string,
    time: number,
    temp: number,
    tempFeels: number,
    description: IWeather
}

export interface IWeatherResponse {
    weatherInfo: IWeatherInfo[],
    city: string
}

export interface IList {
    dt: number
    main: IMain
    weather: IWeather[]
    clouds: IClouds
    wind: IWind
    visibility: number
    pop: number
    rain?: IRain
    sys: ISys
    dt_txt: string
}

export interface IMain {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    sea_level: number
    grnd_level: number
    humidity: number
    temp_kf: number
}

export interface IWeather {
    id: number
    main: string
    description: string
    icon: string
}

export interface IClouds {
    all: number
}

export interface IWind {
    speed: number
    deg: number
    gust: number
}

export interface IRain {
    "3h": number
}

export interface ISys {
    pod: string
}

export interface ICity {
    id: number
    name: string
    coord: ICoord
    country: string
    population: number
    timezone: number
    sunrise: number
    sunset: number
}

export interface ICoord {
    lat: number
    lon: number
}