import React from "react";
import Country from "./Country";
import Weather from "./Weather";

const HandleDisplay = ( {searchCountries, setSearchCountries } ) => {
    if (searchCountries.length > 10)
      return(
          <div>Too many matches, specify another filter</div>
      )
    else if (searchCountries.length > 1)
      return(
          <div>
            <ul>
              {searchCountries.map((country, i) => <li key={i}>{country.name}<button onClick={() => setSearchCountries([country])}>show</button></li>)}
            </ul>
          </div>
      )
    else if (searchCountries.length === 1)
        return(
            <div>
              <Country country={searchCountries[0]}/>
              <Weather capital={searchCountries[0].capital}/>
            </div>
        )
    else
      return(
          <div></div>
      )
  }
  
export default HandleDisplay