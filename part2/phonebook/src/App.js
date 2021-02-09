import React, { useState, useEffect} from 'react'
import './index.css'
import personService from './services/person'
import Persons from "./components/Persons";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm"
import Notification from "./components/Notification"

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewPhone ] = useState('')
  const [ searchName, setSearchName ] = useState('')
  const [notification, setNotification] = useState({message: null, isSuccess: false})

  useEffect(() =>{
      personService
          .getAll()
          .then(persons => setPersons(persons))
  }, [])

  const addPerson = (event) => {
      event.preventDefault()
      const personObject = {
              name: newName,
              number: newNumber
          }
          personService
              .create(personObject)
              .then(personObject => {
                  setPersons(persons.concat(personObject))
                  setNotification({
                      message: `Added ${newName}`,
                      isSuccess: true})
                  }
              )
          setTimeout(() => setNotification({
              message: null,
              isSuccess: false
          }), 5000)
      // const filterPerson = persons.filter(person => person.name === newName)
      // if (filterPerson.length === 0){
      //     const personObject = {
      //         name: newName,
      //         number: newNumber
      //     }
      //     personService
      //         .create(personObject)
      //         .then(personObject => {
      //             setPersons(persons.concat(personObject))
      //             setNotification({
      //                 message: `Added ${newName}`,
      //                 isSuccess: true})
      //             }
      //         )
      //     setTimeout(() => setNotification({
      //         message: null,
      //         isSuccess: false
      //     }), 5000)
      // }
      // else
      //     if(window.confirm(`${newName} is already added to phonebook, replace a old number with a new one?`)) {
      //         const changedPerson = {...filterPerson[0], number: newNumber}
      //         console.log('changedPerson', changedPerson)
      //         personService
      //             .update(changedPerson.id, changedPerson)
      //             .then(returnedPerson => {
      //                 setPersons(persons.map(person => person.id !== returnedPerson.id ? person : returnedPerson))
      //                 setNotification({
      //                     message: `Updated ${newName}`,
      //                     isSuccess: true
      //                 })
      //             })
      //             .catch(error => {
      //                 setNotification({
      //                     message: `Information of ${newName} has already been removed from server`,
      //                     isSuccess: false
      //                 })
      //                 setPersons(persons.filter(person => person.name !== newName))
      //                 console.log(error)
      //             })
      //         setTimeout(() => setNotification({
      //             message: null,
      //             isSuccess: false
      //         }), 5000)
      //     }
      setNewName('')
      setNewPhone('')
    }

  const deletePerson = (person) => {
        console.log(person.name)
        if (window.confirm(`Do you really want to delete ${person.name}`))
            personService
                .remove(person.id)
                .then((result) => {
                    setPersons(persons.filter(p => p.id != person.id))
                    setNotification({
                         message: `Removed ${person.name}`,
                         isSuccess: true
                     })
                })
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
      <Notification message={notification.message} isSuccess={notification.isSuccess}/>
      <h2>Search phone number by name (insensitive)</h2>
      <Filter searchName={searchName} handleSearchName={handleSearchName}/>
      <h2>Phonebook</h2>
      <PersonForm addPerson={addPerson} newName={newName} newNumber={newNumber} handlePersonChange={handlePersonChange} handlePhoneChange={handlePhoneChange}/>
      <h2>Numbers</h2>
      <Persons searchPersons={searchPersons} deletePerson={deletePerson}/>
    </div>
  )
}

export default App