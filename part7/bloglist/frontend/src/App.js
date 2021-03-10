import React, { useEffect, useRef } from 'react'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import LogoutButton from './components/LogoutButton'
import Toggleable from './components/Toggleable'
import Notification from './components/Notification'
import { setNotification  } from './reducers/notificationReducer'
import { useDispatch, useSelector } from "react-redux";
import { setInitialBlogs, createNewBlog } from "./reducers/blogReducer";
import { login, logout, initialUser } from "./reducers/loginReducer";
import { BrowserRouter as Router, Switch, Link, Route} from 'react-router-dom'
import Home from "./components/Home";
import AllUsers from './components/AllUsers'

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setInitialBlogs())
  }, [dispatch])

  const user = useSelector(state => state.user)
  const blogFormRef = useRef()

  useEffect(() => {
    dispatch(initialUser())
  }, [dispatch])

  const handleLogin = async (username, password) => {
    try {
      await dispatch(login(username, password))
      dispatch(setNotification ('login successfully', true, 5))
    } catch (exception) {
      dispatch(setNotification ('invalid username or password', false, 5))
    }
  }

  const handleLogout = async () => {
    await dispatch(logout())
    dispatch(setNotification ('logout successfully', true, 5))
  }

  const handleNewBlog = async (newBlog) => {
    try{
      await dispatch(createNewBlog(newBlog, user))
      if (newBlog.author)
        dispatch(setNotification (`a new blog ${newBlog.title} by ${newBlog.author}`, true, 5))
      else
       dispatch(setNotification (`a new blog ${newBlog.title}`, true, 5))
      blogFormRef.current.toggleVisibility()
    }catch (exception) {
      if (!newBlog.title || !newBlog.url)
        dispatch(setNotification ('missing title or url', false, 5))
    }
  }


  const checkLogin = (user) => {
    if (user === null)
      return(
        <div>
          <Toggleable buttonLabel='login'>
            <LoginForm handleLogin={handleLogin}/>
          </Toggleable>
        </div>
      )
    else
      return(
        <div>
          <LogoutButton handleLogout={handleLogout} user={user}/>
          <Toggleable buttonLabel='create new blog' ref={blogFormRef}>
            <BlogForm handleNewBlog={handleNewBlog}/>
          </Toggleable>
        </div>
      )
  }

  const padding = {
    padding: 5
  }

  return (
    <Router>
      <div>
        <Link stype={padding} to="/">home</Link>
        <Link stype={padding} to="/user">users</Link>
      </div>
       <Notification />
       <h2>blogs</h2>
      {checkLogin(user)}
      <Switch>
        <Route path="/user">
          <AllUsers />
        </Route>
        <Route path="/">
          <Home/>
        </Route>
      </Switch>
    </Router>
  )
}

export default App