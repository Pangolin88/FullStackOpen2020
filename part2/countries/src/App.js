import React, { useState, useEffect } from 'react'
import axios from 'axios'
import HandleDisplay from "./components/HandleDisplay";
import Form from "./components/Form";
import Weather from "./components/Weather";

function App() {
  const [countries, setCountries] = useState([])
  const [searchCountries, setSearchCountries] = useState([])

  useEffect (() => {
    axios
        .get('https://restcountries.eu/rest/v2/all')
        .then(reponse => {
            setCountries(reponse.data)
        })
  }, [])

  const handleCountryChange = (event) => {
    console.log(event.target.value)
    if (event.target.value === '')
      setSearchCountries([])
    else
      setSearchCountries(countries.filter((country) => country.name.toLowerCase().includes(event.target.value)))
  }

  return (
        <div>
            <Form handleCountryChange={handleCountryChange}/>
            <HandleDisplay searchCountries={searchCountries} setSearchCountries={setSearchCountries}/>
            {/*<Weather capital='New York'/>*/}
        </div>
      )
}

export default App;
