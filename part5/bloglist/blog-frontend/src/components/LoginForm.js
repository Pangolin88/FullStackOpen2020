import React, { useState } from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }
  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const login = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    handleLogin(username, password)
    setUsername('')
    setPassword('')
  }

  return(
    <form onSubmit={login}>
      <div>
        username
        <input
          type='text'
          value={username}
          name='Username'
          onChange={handleUsernameChange}
        />
      </div>
      <div>
        password
        <input
          type='password'
          value={password}
          name='Password'
          onChange={handlePasswordChange}
        />
      </div>
      <button type='submit'>login</button>
    </form>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired
}

LoginForm.displayName = 'LoginForm'

export default LoginForm