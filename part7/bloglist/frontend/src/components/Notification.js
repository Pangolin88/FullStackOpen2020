import React from 'react'
import { useSelector } from 'react-redux'
import { Alert } from 'react-bootstrap'

const Notification = () => {
  const message = useSelector(state => state.notification.message)
  const isSuccess = useSelector(state => state.notification.isSuccess)

  if (message === null) {
    return null
  }
  if (isSuccess)
    return (
      <Alert variant="success">
        {message}
      </Alert>
    )
  else
    return (
      <Alert variant="danger">
        {message}
      </Alert>
    )
}

Notification.displayName = 'Notification'

export default Notification