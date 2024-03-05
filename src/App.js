import { useEffect, useState } from 'react';
import './App.css';
import PropTypes from 'prop-types';

import searchIcon from './images/magnifying-glass.png'
import clearIcon1d from './images/sun-01d.png';
import clearIcon1n from './images/moon-01n.png';
import clearIcon2d from './images/sun-02d.png';
import clearIcon2n from './images/cloudy-night-02n.png';
import scatteredClouds from './images/clouds-03d-03n.png'
import brokenClouds from './images/cloudy-04d-04n.png'
import showerRain from './images/snow-09d-09n.png'
import rainIconD from './images/rain-10d.png'
import rainIconN from './images/rain-10n.png'
import stormIcon from './images/storm-11d-11n.png'
import windIcon from './images/wind.png'
import snowIcon from './images/snowflake-13d-13n.png'
import humidityIcon from './images/humidity.png'

const WeatherDetails = ({ icon, temp, city, country, lat, log, humidity, wind }) => {
  return (
    <>
      <div className="image">
        <img src={icon} alt="Images" />
      </div>
      <div className="temp">{temp}°C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div>
          <span className='lat'>latitude</span>
          <span >{lat}</span>
        </div>
        <div>
          <span className='log'>longitude</span>
          <span >{log}</span>
        </div>
      </div>
      <div className="dataContainer">
        <div className="element">
          <img src={humidityIcon} alt="humidity" className='icon' />
          <div className="data">
            <div className="humidityPercent">{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={windIcon} alt="wind" className='icon' />
          <div className="data">
            <div className="windPercent">{wind} km/hr</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  )
}

WeatherDetails.propTypes = {
  icon: PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  lat: PropTypes.number.isRequired,
  log: PropTypes.number.isRequired,
  humidity: PropTypes.number.isRequired,
  wind: PropTypes.number.isRequired
}

function App() {
  let api_key = "9e4cb8ef013221279054222dec38981d"
  const [text, setText] = useState("Trichy")

  const [icon, setIcon] = useState(snowIcon)
  const [temp, setTemp] = useState(0)
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState(0);
  const [log, setLog] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);
  const [error, setError] = useState(null);
  // const [,set]=useState(0);

  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const weatherIconMap = {
    "01d": clearIcon1d,
    "01n": clearIcon1n,
    "02d": clearIcon2d,
    "02n": clearIcon2n,
    "03d": scatteredClouds,
    "03n": scatteredClouds,
    "04d": brokenClouds,
    "04n": brokenClouds,
    "09d": showerRain,
    "09n": showerRain,
    "10d": rainIconD,
    "10n": rainIconN,
    "11d": stormIcon,
    "11n": stormIcon,
    "13d": snowIcon,
    "13n": snowIcon,
  }

  const search = async () => {
    setLoading(true);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;

    try {
      let res = await fetch(url);
      let data = await res.json();
      // console.log(data)
      if (data.cod === "404") {
        console.error("City Not Found")
        setCityNotFound(true);
        setLoading(false);
        return;
      }
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp))
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLog(data.coord.lon);
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || clearIcon1d)
      setCityNotFound(false);
    } catch (error) {
      console.error("An error occured:", error.message);
      setError("An error occurred while fetching weather data...")
    } finally {
      setLoading(false);
    }
  }

  const handleCity = (e) => { setText(e.target.value) }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  }

  useEffect(
    () => {
      search()
    }, [])
  return (
    <>
      <div className="container">
        <div className="input-container">
          <input type="text"
            className='cityInput' placeholder='Search City'
            onChange={handleCity}
            value={text}
            onKeyDown={handleKeyDown} />
          <div className="searchIcon" onClick={() => search()}>
            <img src={searchIcon} alt="" />
          </div>
        </div>

        {loading && <div className="loadingMessage">Loading...</div>}
        {error && <div className="errorMessage">{error}</div>}
        {cityNotFound && <div className="cityNotFound">City not found</div>}

        {!loading && !cityNotFound && <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} log={log} humidity={humidity} wind={wind} />}
        <p className="copyRight">
          Designed by <span>Dinesh</span>
        </p>
      </div>
    </>
  );
}

export default App;
