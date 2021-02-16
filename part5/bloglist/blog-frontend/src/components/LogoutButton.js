import React from 'react'
import PropTypes from 'prop-types'

const LogoutButton = ({ handleLogout, user }) => {
  return(
    <div>
      {user.name} logged in
      <button onClick={handleLogout}>logout</button>
    </div>
  )
}

LogoutButton.propTypes = {
  handleLogout: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

LogoutButton.displayName = 'LogoutButton'

export default LogoutButton