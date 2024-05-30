const container = document.querySelector('.container');
const search = document.querySelector('.search');
const weather = document.querySelector('.weather');
const quality = document.querySelector('.quality');
const humidity = document.querySelector('.quality .first .humidity');
const airspeed = document.querySelector('.quality .second .air-speed');
const degrees = document.querySelector('.temparature .one');
const img = document.querySelector('.image .imagesrc');
const datetext=document.querySelector('.location p')
const description = document.querySelector('.temparature .two h2');
const errordiv = document.querySelector('.error');
const windDirection=document.querySelectorAll('.air-detailes  p')
const sun=document.querySelectorAll('.mid-detiales p');
const divs=document.querySelectorAll('.temp-detailes .divs div p')



const APIKey = '5d9a008eb24af2826aa49953589084cb';


//date conversation
let currentDate = new Date();
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
const day = String(currentDate.getDate()).padStart(2, '0'); 
const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const formattedDate = `${year}-${month}-${day} ${daysOfWeek[currentDate.getDay()]}`;
const currentHour = currentDate.getHours();
let basePath = './day/';
if (currentHour < 6 || currentHour >= 18) {
    basePath = './night/';
}


//fetchweather function
function fetchWeather(city) {
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;

    fetch(URL)
        .then((response) => response.json())
        .then((data) => {
            if (data.cod === '404') {
                weather.classList.remove('active');
                errordiv.classList.add('active');
                return;
            }
            weather.classList.add('active');
            errordiv.classList.remove('active');
            humidity.textContent = `${data.main.humidity}%`;
            degrees.innerHTML = `${(data.main.temp - 273.15).toFixed(2)} &#8451;`;
            airspeed.textContent = `${data.wind.speed} Km/h`;
            description.textContent=`${data.weather[0].description}`;
            datetext.textContent=formattedDate;

            //forecast
            divs[0].textContent=`${data.name}, ${data.sys.country}`
            divs[1].innerHTML= `${(data.main.temp - 273.15).toFixed(2)} &#8451;`;
            divs[2].innerHTML=`${(data.main.feels_like- 273.15).toFixed(2)} &#8451;`;
            divs[3].textContent=`${data.main.pressure} ATM`;
            divs[4].innerHTML= `${(data.main.temp_max - 273.15).toFixed(2)} &#8451;`;
            divs[5].innerHTML= `${(data.main.temp_min - 273.15).toFixed(2)} &#8451;`;
          

            

            //wind direction
            windDirection[0].textContent=direction(`${data.wind.deg}`);
            windDirection[1].textContent=`Wind Gust : ${data.wind.gust} Km/h`;

            //sumset and rise
            sun[0].textContent=convertingTime(`${data.sys.sunrise}`)
            sun[1].textContent=convertingTime(`${data.sys.sunset}`)


            switch (data.weather[0].main) {
                case 'Clear':
                    img.src = basePath+'clear.png';
                    break
                case 'Rain':
                    img.src = './day/rain.png';
                    break;
                case 'Snow':
                    img.src = './day/snow.png';
                    break;
                case 'Clouds':
                    img.src = basePath+'cloud.png';
                    break;
                case 'Mist':
                case 'Haze':
                    img.src = basePath+'mist.png';
                    break;
            }
            console.log(data);
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
}

//sending city
search.addEventListener('click', () => {
    let city = document.querySelector('.city').value.trim();
    if (city === '') {
        return;
    }
    fetchWeather(city);
});


//converting direction
function direction(degree){
    let directions=['North', 'Northeast', 'East', 'Southeast', 
    'South', 'Southwest', 'West', 'Northwest'];
    const index = Math.round(degree / 45) % 8;
    return 'Wind Direction : '+directions[index];
}

//converting unix stamp to time
function convertingTime(timeStamp) {
    const date = new Date(timeStamp * 1000);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const hoursStr = hours.toString().padStart(2, '0');
    return `${hoursStr}:${minutes}:${seconds} ${ampm}`;
}


//dom content loading function
document.addEventListener('DOMContentLoaded', () => {
    const defaultCity = 'Kolkata'; 
    fetchWeather(defaultCity);
});




// name
// main  - feels like,pressure,temp,min max
// sys-country,surise,sunset,
// wind-deg,gust,speed

