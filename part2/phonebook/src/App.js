import React, { useState } from 'react'

const App = () => {
  const [ persons, setPersons ] = useState([
    {   name: 'Huynh Vi Ha',
        phone: '0766901516',
        id: 1,
    }
  ])
  const [ newName, setNewName ] = useState('')
  const [ newPhone, setNewPhone ] = useState('')


  const addPerson = (event) => {
      event.preventDefault()
      const personObject = {
          name: newName,
          phone: newPhone,
          id: persons.length + 1,
      }
      const personName = persons.map(person => person.name)
      const pos = personName.indexOf(newName)
      console.log(pos)
      if (pos === -1) {
          setPersons(persons.concat(personObject))
      }
      else
          window.alert(`${newName} is already added to phonebook`)
      setNewName('')
      setNewPhone('')
    }

  const handlePersonChange = (event) => {
      console.log(event.target.value)
      setNewName(event.target.value)
  }

  const handlePhoneChange = (event) => {
      console.log(event.target.value)
      setNewPhone(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handlePersonChange}/>
        </div>
        <div>
          number: <input value={newPhone} onChange={handlePhoneChange}/>
        </div>

        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
       <div>
        <ul>
            {persons.map(person => <li key = {person.id}>{person.name} {person.phone}</li>)}
        </ul>
       </div>
    </div>
  )
}

export default App