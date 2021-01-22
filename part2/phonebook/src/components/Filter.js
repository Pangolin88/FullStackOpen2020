import React from 'react'

const Filter = ({ searchName, handleSearchName }) => {
    return(
        <form>
          <div>
              filter name with <input value={searchName} onChange={handleSearchName}/>
          </div>
      </form>
    )
}

export default Filter