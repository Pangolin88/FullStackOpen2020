import React from 'react'

const Persons = ({ searchPersons, deletePerson}) => {
    return(
        <div>
        <ul>
            {searchPersons.map((person, id) => <li key = {id}>
                {person.name} {person.number}
                <button onClick={() => deletePerson(person)}>delete</button>
            </li>)}
        </ul>
       </div>
    )
}

export default Persons