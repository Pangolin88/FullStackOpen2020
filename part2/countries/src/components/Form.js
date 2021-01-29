import React from 'react'

const Form = ( {handleCountryChange} ) => {
    return(
        <form>
               <div>
                 find countries: <input onChange={handleCountryChange}/>
               </div>
            </form>
    )
}

export default Form