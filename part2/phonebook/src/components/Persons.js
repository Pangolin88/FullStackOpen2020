import React from 'react'

const Persons = ({ searchPersons }) => {
    return(
        <div>
        <ul>
            {searchPersons.map((person, id) => <li key = {id}>{person.name} {person.number}</li>)}
        </ul>
       </div>
    )
}

export default Persons