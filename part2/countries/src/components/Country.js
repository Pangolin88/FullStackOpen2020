import React from 'react'

const Country = ( {country} ) => {
    return(
          <div>
            <h1>{country.name}</h1>
            <p>capital {country.capital}</p>
            <p>population {country.population}</p>
            <h2>Languages</h2>
            <ul>
              {country.languages.map((language, i) => <li key={i}>{language.name}</li>)}
            </ul>

            <img src={country.flag} alt="Flag" width="200" height="140"/>
          </div>
      )
  }
export default Country