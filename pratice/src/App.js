import React, { useState, useEffect } from 'react'
import noteService from './services/note'
import Notification from "./components/Notification";

const Note = ({ note, toggleImportance }) => {
  const label = note.important
    ? 'make not important' : 'make important'

  return (
    <li className='note'>
      {note.content}
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }
  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2020</em>
    </div>
  )
}


const App = (props) => {
   const [notes, setNotes] = useState(props.notes)
   const [newNote, setNewNote] = useState('a new note...')
   const [errorMessage, setErrorMessage]  = useState(null)

  const addNote = event => {
  event.preventDefault()
  const noteObject = {
    content: newNote,
    date: new Date(),
    important: Math.random() < 0.5,
  }

  noteService
      .create(noteObject)
      .then(noteObject => {
          setNotes(notes.concat(noteObject))
          setNewNote('')
          console.log(noteObject)
        })
}

  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  const toggleImportanceOf = id => {
      const note = notes.find(n => n.id === id)
      const changedNote = {...note, important: !note.important}

      noteService
          .update(id, changedNote)
          .then(returnedNote => {
              setNotes(notes.map(note => note.id !== id ? note : returnedNote))
          })
          .catch(error => {
              setErrorMessage(`Note ${note.content} was already removed on server`)
              setTimeout(() => {
                setErrorMessage(null)
                }, 5000)
              setNotes(notes.filter(n => n.id !== id))
          })
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage}/>
      <ul>
        {notes.map(note =>
          <Note key={note.id}
                note={note}
                toggleImportance={() => toggleImportanceOf(note.id)}/>
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote}
        onChange={handleNoteChange}/>
        <button type="submit">save</button>
      </form>
      <Footer/>
    </div>
  )
}

export default App