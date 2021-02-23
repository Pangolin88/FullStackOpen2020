const notificationReducer = (start = 'Welcome !', action) => {
  switch (action.type) {
    case 'NOTI':
      return action.data
    default:
      return start
  }
}

export default notificationReducer