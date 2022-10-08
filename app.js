// Импорт необходимых библиотек
import express from 'express';
import pg from 'pg';
import fetch from 'node-fetch';
import momentZone from 'moment-timezone';
import fs from 'fs';

//Создание объекта сервера
const app = express();

//Присвоение необходимых для подключения к бд конфигураций
const client = new pg.Client({
    user: 'postgres',
    host: '172.16.117.193',
    database: 'postgres',
    password: 'avalance460',
    port: 5632,
});

// //Подключение клиента бд
// client.connect();

//Присваивание порта прослушивания
const { PORT = 3005 } = process.env;

            const query = `
              INSERT INTO data_for_ml_from_open_meteo (temperature_2m, relativehumidity_2m, dewpoint_2m, apparent_temperature,
              precipitation, rain, showers, snowfall, snow_depth, freezinglevel_height, weathercode, pressure_msl, surface_pressure,
              cloudcover, cloudcover_low, cloudcover_mid, cloudcover_high_now, evapotranspiration_now, et0_fao_evapotranspiration_now,
              vapor_pressure_deficit_now, windspeed_10m_now, windspeed_80m_now, windspeed_120m_now, windspeed_180m_now,
              winddirection_10m_now, winddirection_80m_now, winddirection_120m_now, winddirection_180m_now, windgusts_10m_now,
              temperature_80m_now, temperature_120m_now, temperature_180m_now, soil_temperature_0cm_now, soil_temperature_6cm_now,
              soil_temperature_18cm_now, soil_temperature_54cm_now, soil_moisture_0_1cm_now, soil_moisture_1_3cm_now,
              soil_moisture_3_9cm_now, soil_moisture_9_27cm_now, soil_moisture_27_81cm_now,
              weathercodeDay, temperature_2m_max, temperature_2m_min, apparent_temperature_max, apparent_temperature_min,
              sunrise, sunset, precipitation_sum, rain_sum, showers_sum, snowfall_sum, precipitation_hours, windspeed_10m_max,
              windgusts_10m_max, winddirection_10m_dominant, shortwave_radiation_sum, et0_fao_evapotranspirationDay, mark, currentTime)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25,
              $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50,
              $51, $52, $53, $54, $55, $56, $57, $58, $59, $60 ) returning *
            `;
//Ключ-ссылка
const apiLink =
 "https://api.open-meteo.com/v1/forecast?latitude=67.75&longitude=33.68&hourly=temperature_2m,relativehumidity_2m,dewpoint_2m,apparent_temperature,precipitation,rain,showers,snowfall,snow_depth,freezinglevel_height,weathercode,pressure_msl,surface_pressure,cloudcover,cloudcover_low,cloudcover_mid,cloudcover_high,evapotranspiration,et0_fao_evapotranspiration,vapor_pressure_deficit,windspeed_10m,windspeed_80m,windspeed_120m,windspeed_180m,winddirection_10m,winddirection_80m,winddirection_120m,winddirection_180m,windgusts_10m,temperature_80m,temperature_120m,temperature_180m,soil_temperature_0cm,soil_temperature_6cm,soil_temperature_18cm,soil_temperature_54cm,soil_moisture_0_1cm,soil_moisture_1_3cm,soil_moisture_3_9cm,soil_moisture_9_27cm,soil_moisture_27_81cm&timezone=Europe%2FMoscow";

//Функция промежуточного программирования
app.use(express.json());

//Функция сбора данных по аргументу link
function fetchDataOpenmeteo(link, requestedHour){
  //fetch функция по аргументу link
  fetch(link)
    //Представление ответа в json формат
    .then(res => res.json())
    .then(json => {
        console.log(requestedHour)

            let currentTime = momentZone().tz("Europe/Moscow").format();

            client.query(query, [json.hourly.temperature_2m[requestedHour], json.hourly.relativehumidity_2m[requestedHour],
             json.hourly.dewpoint_2m[requestedHour], json.hourly.apparent_temperature[requestedHour], json.hourly.precipitation[requestedHour],
             json.hourly.rain[requestedHour], json.hourly.showers[requestedHour], json.hourly.snowfall[requestedHour],
             json.hourly.snow_depth[requestedHour], json.hourly.freezinglevel_height[requestedHour],
             json.hourly.weathercode[requestedHour], json.hourly.pressure_msl[requestedHour], json.hourly.surface_pressure[requestedHour],
             json.hourly.cloudcover[requestedHour], json.hourly.cloudcover_low[requestedHour], json.hourly.cloudcover_mid[requestedHour],
             json.hourly.cloudcover_high[requestedHour], json.hourly.evapotranspiration[requestedHour],
             json.hourly.et0_fao_evapotranspiration[requestedHour], json.hourly.vapor_pressure_deficit[requestedHour],
             json.hourly.windspeed_10m[requestedHour], json.hourly.windspeed_80m[requestedHour], json.hourly.windspeed_120m[requestedHour],
             json.hourly.windspeed_180m[requestedHour], json.hourly.winddirection_10m[requestedHour], json.hourly.winddirection_80m[requestedHour],
             json.hourly.winddirection_120m[requestedHour], json.hourly.winddirection_180m[requestedHour], json.hourly.windgusts_10m[requestedHour],
             json.hourly.temperature_80m[requestedHour], json.hourly.temperature_120m[requestedHour], json.hourly.temperature_180m[requestedHour],
             json.hourly.soil_temperature_0cm[requestedHour], json.hourly.soil_temperature_6cm[requestedHour],
             json.hourly.soil_temperature_18cm[requestedHour], json.hourly.soil_temperature_54cm[requestedHour],
             json.hourly.soil_moisture_0_1cm[requestedHour], json.hourly.soil_moisture_1_3cm[requestedHour], json.hourly.soil_moisture_3_9cm[requestedHour],
             json.hourly.soil_moisture_9_27cm[requestedHour], json.hourly.soil_moisture_27_81cm[requestedHour],
             json.daily.weathercode[0], json.daily.temperature_2m_max[0], json.daily.temperature_2m_min[0], json.daily.apparent_temperature_max[0],
             json.daily.apparent_temperature_min[0], json.daily.sunrise[0], json.daily.sunset[0], json.daily.precipitation_sum[0],
             json.daily.rain_sum[0], json.daily.showers_sum[0], json.daily.snowfall_sum[0], json.daily.precipitation_hours[0],
             json.daily.windspeed_10m_max[0], json.daily.windgusts_10m_max[0], json.daily.winddirection_10m_dominant[0],
             json.daily.shortwave_radiation_sum[0], json.daily.et0_fao_evapotranspiration[0], requestedHour, currentTime
             ], (err, res) => {
              if (err) {
                console.error(err);
                return;
              }
              console.log('Data insert successful');
            });


      })
      .catch(err =>{

      })

}

function allFetch(){
  var newTime = new Date().getHours();
  for(let i = newTime; i <= newTime+23; i++){
    fetchDataOpenmeteo(apiLink, i);
  }
}
//Функция, реализующая сбор данных с заданным интервалом
let timerId = setInterval(() => allFetch(), 60000);

//Использование порта для работы сервера
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
