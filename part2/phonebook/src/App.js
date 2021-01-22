import React, { useState } from 'react'

const App = () => {
  const [ persons, setPersons ] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewPhone ] = useState('')
  const [ searchName, setSearchName ] = useState('')


  const addPerson = (event) => {
      event.preventDefault()
      const personObject = {
          name: newName,
          number: newNumber,
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

  const handleSearchName = (event) => {
      console.log(event.target.value)
      setSearchName(event.target.value)
  }

  const searchPersons = searchName === '' ? persons : persons.filter(person => person.name.toLocaleLowerCase().includes(searchName.toLocaleLowerCase()))

  return (
    <div>
      <h2>Search phone number by name (insensitive)</h2>
      <form onChange={handleSearchName}>
          <div>
              filter name with <input value={searchName}/>
          </div>
      </form>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handlePersonChange}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={handlePhoneChange}/>
        </div>

        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
       <div>
        <ul>
            {searchPersons.map((person, id) => <li key = {id}>{person.name} {person.number}</li>)}
        </ul>
       </div>
    </div>
  )
}

export default App