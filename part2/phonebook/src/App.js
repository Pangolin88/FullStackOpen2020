import React, { useState } from 'react'
import Persons from "./components/Persons";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";

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
      setNewName(event.target.value)
  }

  const handlePhoneChange = (event) => {
      setNewPhone(event.target.value)
  }

  const handleSearchName = (event) => {
      setSearchName(event.target.value)
  }

  const searchPersons = searchName === '' ? persons : persons.filter(person => person.name.toLocaleLowerCase().includes(searchName.toLocaleLowerCase()))

  return (
    <div>
      <h2>Search phone number by name (insensitive)</h2>
      <Filter searchName={searchName} handleSearchName={handleSearchName} />
      <h2>Phonebook</h2>
      <PersonForm addPerson={addPerson} newName={newName} newNumber={newNumber} handlePersonChange={handlePersonChange} handlePhoneChange={handlePhoneChange}/>
      <h2>Numbers</h2>
      <Persons searchPersons={searchPersons}/>
    </div>
  )
}

export default App