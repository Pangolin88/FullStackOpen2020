const notificationReducer = (start = '', action) => {
  switch (action.type) {
    case 'CHANGE':
      return action.data
    default:
      return start
  }
}

export const changeNotification = (content) => {
  return {
    type: 'CHANGE',
    data: content
  }
}

export default notificationReducer