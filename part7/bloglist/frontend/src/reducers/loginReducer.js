import loginService from '../services/login'
import blogService from "../services/blogs";

const loginReducer = (state = null, action) =>{
  switch (action.type) {
    case 'LOGIN':
      return action.data
    case 'LOGOUT':
      return null
    default:
      return state
  }
}

export const login = (username, password) => {
  return async dispatch => {
    const loginedUser = await loginService.login({
      username, password
    })
    window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(loginedUser)
      )
    blogService.setToken(loginedUser.token)
    dispatch({
      type: 'LOGIN',
      data: loginedUser
    })
  }
}

export const logout = () => {
  return dispatch => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch({
      type: 'LOGOUT'
    })
  }
}

export const initialUser = () => {
  return async dispatch => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      await blogService.setToken(user.token)
      dispatch({
        type: 'LOGIN',
        data: user
      })
    }
  }
}

export default loginReducer