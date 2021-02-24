const notificationReducer = (start = '', action) => {
  switch (action.type) {
    case 'SET':
      return action.data
    default:
      return start
  }
}

export const setNotification = (content) => {
  return {
    type: 'SET',
    data: content
  }
}

export default notificationReducer