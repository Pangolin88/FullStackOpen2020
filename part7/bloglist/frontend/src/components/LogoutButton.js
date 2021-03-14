import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'

const LogoutButton = ({ handleLogout, user }) => {
  return(
    <div className='logged'>
      {user.name} logged in
      <Button onClick={handleLogout}>logout</Button>
    </div>
  )
}

LogoutButton.propTypes = {
  handleLogout: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

LogoutButton.displayName = 'LogoutButton'

export default LogoutButton