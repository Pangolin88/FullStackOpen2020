import React, { useState, useEffect} from 'react'
import axios from 'axios'
import Persons from "./components/Persons";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm"

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewPhone ] = useState('')
  const [ searchName, setSearchName ] = useState('')

  useEffect(() =>{
      axios
          .get('http://localhost:3001/persons')
          .then(reponse => {
              setPersons(reponse.data)
          })
  }, [])

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

  const searchPersons = searchName === ''
      ? persons
      : persons.filter(person => person.name.toLocaleLowerCase().includes(searchName.toLocaleLowerCase()))

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