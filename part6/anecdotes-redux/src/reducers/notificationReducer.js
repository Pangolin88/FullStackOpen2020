const initialState = {
  message: '',
  delay: null
}

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET':
      clearTimeout(state.delay)
      return action.data
    case 'CLEAR':
      return initialState
    default:
      return state
  }
}

export const setNotification = (content, time) => {
  return async dispatch => {
    dispatch({
      type: 'SET',
      data: {
        message : content,
        delay: setTimeout(() => dispatch({
          type: 'CLEAR'
        }), time*1000)
      }
    })
  }
}

export default notificationReducer