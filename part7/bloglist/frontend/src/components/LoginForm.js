import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Button } from 'react-bootstrap'

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
    await  handleLogin(username, password)
    setUsername('')
    setPassword('')
  }

  return(
    <div>
      <Form onSubmit={login}>
        <Form.Group>
          <Form.Label>username</Form.Label>
          <Form.Control
            type='text'
            name='username'
            onChange={handleUsernameChange}
          />
          <Form.Label>password</Form.Label>
          <Form.Control
            type='password'
            onChange={handlePasswordChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          login
        </Button>
      </Form>
    </div>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired
}

LoginForm.displayName = 'LoginForm'

export default LoginForm