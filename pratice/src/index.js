import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'

import axios from 'axios'

const nonExisting = {
    id: 10000,
    content: 'This note is not saved to server',
    date: '2019-05-30T17:30:31.098Z',
    important: true,
  }

axios.get('http://localhost:3001/notes').then(response => {
  const notes = response.data.concat(nonExisting)
  ReactDOM.render(
    <App notes={notes} />,
    document.getElementById('root')
  )
})