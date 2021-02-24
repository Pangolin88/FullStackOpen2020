const notificationReducer = (start = '', action) => {
  switch (action.type) {
    case 'SET':
      return action.data
    case 'CLEAR':
      return ''
    default:
      return start
  }
}

export const setNotification = (content, time) => {
  return async dispatch => {
    dispatch({
      type: 'SET',
      data: content
    })
    setTimeout(() => dispatch({
      type: 'CLEAR'
    }), time*1000)
  }
}

export default notificationReducer