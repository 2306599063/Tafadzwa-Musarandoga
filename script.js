const apiKey = '031da008a199cab2fc787554babe2db6';

async function getWeather() {
    const location = document.getElementById('location').value;
    const weatherInfo = document.getElementById('weather-info');
    const errorMessage = document.getElementById('error-message');
    const forecastDiv = document.getElementById('forecast');
    const currentTime = document.getElementById('current-time');
    const body = document.getElementById('body');

    weatherInfo.style.display = 'none';
    errorMessage.style.display = 'none';
    forecastDiv.innerHTML = '';

    if (location.trim() === '') {
        errorMessage.textContent = 'Please enter a location.';
        errorMessage.style.display = 'block';
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;

    try {
        const currentWeatherResponse = await fetch(currentWeatherUrl);
        const currentWeatherData = await currentWeatherResponse.json();

        if (currentWeatherData.cod !== 200) {
            errorMessage.textContent = `Error: ${currentWeatherData.message}`;
            errorMessage.style.display = 'block';
            return;
        }

        document.getElementById('weather-location').textContent = `Weather in ${currentWeatherData.name}, ${currentWeatherData.sys.country}`;
        document.getElementById('weather-description').textContent = `Description: ${currentWeatherData.weather[0].description}`;
        document.getElementById('weather-temperature').textContent = `Temperature: ${currentWeatherData.main.temp}°C`;

        const iconCode = currentWeatherData.weather[0].icon;
        document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        const timezoneOffset = currentWeatherData.timezone;
        const localTime = new Date((new Date().getTime()) + (timezoneOffset * 1000));
        currentTime.textContent = `Local time: ${localTime.toLocaleString()}`;

        const weatherCondition = currentWeatherData.weather[0].main.toLowerCase();
        setWeatherBackground(weatherCondition, body);

        weatherInfo.style.display = 'block';

        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        const dailyForecast = {};
        forecastData.list.forEach((entry) => {
            const date = new Date(entry.dt * 1000).toLocaleDateString('en-GB', { weekday: 'long' });
            if (!dailyForecast[date]) {
                dailyForecast[date] = entry;
            }
        });

        Object.keys(dailyForecast).slice(0, 5).forEach((day) => {
            const forecastItem = dailyForecast[day];
            const forecastIcon = `https://openweathermap.org/img/wn/${forecastItem.weather[0].icon}@2x.png`;
            const forecastTemp = forecastItem.main.temp;
            const forecastDescription = forecastItem.weather[0].description;

            const forecastHTML = `
                <div class="forecast-item">
                    <p>${day}</p>
                    <img src="${forecastIcon}" alt="Weather Icon">
                    <p>${forecastTemp}°C</p>
                    <p>${forecastDescription}</p>
                </div>
            `;

            forecastDiv.innerHTML += forecastHTML;
        });
    } catch (error) {
        console.error('Error fetching weather data:', error);
        errorMessage.textContent = 'An error occurred while fetching the weather data. Please try again.';
        errorMessage.style.display = 'block';
    }
}

function setWeatherBackground(condition, body) {
    switch (condition) {
        case 'clear':
            body.style.backgroundImage = "url('img/clear-sky.jpg')";
            break;
        case 'clouds':
            body.style.backgroundImage = "url('img/pexels-pixabay-531756.jpg')";
            break;
        case 'rain':
            body.style.backgroundImage = "url('img/rainy-sky.jpg')";
            break;
        case 'snow':
            body.style.backgroundImage = "url('img/snowy-sky.jpg')";
            break;
        case 'thunderstorm':
            body.style.backgroundImage = "url('img/thunderstorm-sky.jpg')";
            break;
        default:
            body.style.backgroundImage = "url('img/default-weather.jpg')";
            break;
    }
}
