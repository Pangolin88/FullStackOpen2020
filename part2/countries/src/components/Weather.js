import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ( {capital} ) => {
  const [weather, setWeather] = useState({})

  const api_key = process.env.REACT_APP_WEATHER_KEY
  console.log(capital)
  useEffect (() => {
    axios
        .get('http://api.weatherstack.com/current', {
        params: {
          query: capital,
          access_key: api_key
        }
      })
        .then(reponse => {
            console.log(reponse.data.current)
            setWeather(reponse.data.current)
        })
  }, [])
     console.log(weather)
    return(
        <div>
              <h2>Weather in {capital}</h2>
              <p><b>temperature: </b>{weather.temperature} Celcius</p>
              <img src={weather.weather_icons} alt="Weather icons" width="100" height="100"/>
              <p><b>wind: </b>{weather.wind_degree} mph direction {weather.wind_dir}</p>
          </div>
    )
}

export default Weather