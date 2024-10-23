import React, { useEffect, useState } from 'react'
import './WeatherApp.css'
// import

import searchIcon from './assets/search.png'
import clearIcon from './assets/clear.png'
import cloudIcon from './assets/cloud.jfif'
import dizzleIcon from './assets/dizzle.jpg'
import humidityIcon from './assets/humidity.webp'
import rainIcon from './assets/rain.png'
import snowIcon from './assets/snow.png'
import windIcon from './assets/wind.png'


const WeatherDetails = ({ icon, temp, city, country, lat, lot, humidity, wind }) => {
  return (
    <>
      <div className="image">
        <img src={icon} alt="Image" />
      </div>
      <div className="temp">{temp}°C</div>
      <div className="city">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div>
          <span className="lat">latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className="lot">longitude</span>
          <span>{lot}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidityIcon} className='icon' alt="" />
          <div className="data">
            <div className="humidity-percent">{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={windIcon} className='icon' alt="" />
          <div className="data">
            <div className="wind-percent">{wind} km/h</div>
            <div className="text">Wind speed</div>
          </div>
        </div>
      </div>
    </>
  )
}



export default function WeatherApp() {
  const [icon, setIcon] = useState(clearIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [lat, setLat] = useState(0);
  const [lot, setLog] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);

  const [cityNotFound, setCityNotFound] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error,setError] = useState(null);

  const [text, setText] = useState("londen")
  const api_key = "b77c568f267247ceffc0acd93463bb87"

  const weatherIconMap = {
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": dizzleIcon,
    "03n": dizzleIcon,
    "04d": dizzleIcon,
    "04n": dizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon,
  };

  const search = async () => {
    setLoading(true)
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`
    // https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric
    try {
      let res = await fetch(url);
      let data = await res.json();
      // console.log(data);
      if (data.cod === "404") {
        console.log(data.message);
        setCityNotFound(true)
        setLoading(false)
        return;
      }

      setHumidity(data.main.humidity)
      setWind(data.wind.speed)
      setTemp(Math.floor(data.main.temp))
      setCity(data.name)
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLog(data.coord.lon);
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || clearIcon)
      console.log(weatherIconCode);
      console.log(weatherIconMap[weatherIconCode]);
      
      setCityNotFound(false)

    }
    catch (error) {
      console.log("An error occured:", error.message);
      setError("An error occured while fetching weather data.")
    }
    finally {
      setLoading(false)
      
    }
  };

  const handleCity = (e) => {
    setText(e.target.value)
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search()
    }
  }

  useEffect(function(){
    search()
  },[])

  return (
    <div>
      <div className="container">
        <div className="input-container">
          <input type="text" className='cityInput'
            value={text} onChange={handleCity}
            placeholder='Search City'
            onKeyDown={handleKeyDown}
          />
          <div className="search-icon">
            <img src={searchIcon} alt="Search" height={'15'} width={'15'} onClick={() => search()} />
          </div>
        </div>

        {loading && <div className="loading-message">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        {cityNotFound && <div className="city-not-found">{}City not found</div>}

        { !loading && !cityNotFound && <WeatherDetails icon={icon} temp={temp} city={city} country={country} 
        lat={lat} lot={lot} humidity={humidity} wind={wind} />}
        <p className="copyright">
          Designed by &#169; <span>Kaviyarasu R</span>
        </p>
      </div>
    </div>
  )
}
