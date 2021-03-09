import React from 'react'
import { useSelector } from 'react-redux'

const Notification = () => {
  const message = useSelector(state => state.notification.message)
  const isSuccess = useSelector(state => state.notification.isSuccess)

  if (message === null) {
    return null
  }
  if (isSuccess)
    return (
      <div className='success'>
        {message}
      </div>
    )
  else
    return (
      <div className='error'>
        {message}
      </div>
    )
}

Notification.displayName = 'Notification'

export default Notification