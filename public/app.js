document.getElementById('get-weather').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            console.log(`Latitude: ${lat}, Longitude: ${lon}`);
            getWeatherByCoordinates(lat, lon);
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});

const getWeatherByCoordinates = (lat, lon) => {
    const apiKey = '8db836eba8497ebff5b37ef1495b73d3'; // Replace with a valid OpenWeather API key
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    console.log(`Fetching weather data from URL: ${url}`);

    document.getElementById('weather-details').innerHTML = `<p>Loading...</p>`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Weather data:', data);
            displayCurrentWeather(data);
            displayWeeklyForecast(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            document.getElementById('weather-details').innerHTML = `<p>Error: ${error.message}</p>`;
        });
};

const displayCurrentWeather = (data) => {
    const currentWeather = `
        <h2>Current Weather</h2>
        <p>Temperature: ${data.list[0].main.temp} °C</p>
        <p>Weather: ${data.list[0].weather[0].description}</p>
    `;
    document.getElementById('weather-details').innerHTML = currentWeather;
};

const displayWeeklyForecast = (data) => {
    let weeklyForecast = '<h2>5-Day Forecast</h2>';
    
    const dailyData = data.list.filter((reading) => reading.dt_txt.includes("12:00:00"));
    
    dailyData.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString(undefined, { weekday: 'long' });

        weeklyForecast += `
            <p>${dayName}: ${day.main.temp} °C, ${day.weather[0].description}</p>
        `;
    });

    document.getElementById('weekly-forecast').innerHTML = weeklyForecast;
};
