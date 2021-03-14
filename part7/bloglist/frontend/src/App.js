import React, { useEffect, useRef } from 'react'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import LogoutButton from './components/LogoutButton'
import Toggleable from './components/Toggleable'
import Notification from './components/Notification'
import AllBlogs from './components/AllBlogs'
import AllUsers from './components/AllUsers'
import User from './components/User'
import Blog from './components/Blog'

import { initialUsers } from './reducers/userReducer'
import { setNotification  } from './reducers/notificationReducer'
import { useDispatch, useSelector } from 'react-redux'
import { initialBlogs, createNewBlog } from './reducers/blogReducer'
import { login, logout, initialUser } from './reducers/loginReducer'
import { BrowserRouter as Router, Switch, Link, Route } from 'react-router-dom'
import { Navbar, Nav } from "react-bootstrap";

const App = () => {
  const dispatch = useDispatch()

  useEffect( () => {
    console.log('render')
    dispatch(initialUsers())
    dispatch(initialBlogs())
    dispatch(initialUser())
  }, [dispatch])

  const user = useSelector(state => state.user)
  const blogFormRef = useRef()

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
        <Toggleable buttonLabel='login'>
          <LoginForm handleLogin={handleLogin}/>
        </Toggleable>
      )
    else
      return(
        <LogoutButton handleLogout={handleLogout} user={user}/>
      )
  }

  const checkAllowCreateNote = (user) => {
    if (user)
      return(
        <Toggleable buttonLabel='create new blog' ref={blogFormRef}>
          <BlogForm handleNewBlog={handleNewBlog}/>
        </Toggleable>
      )
  }


  const Menu = () => {
    const padding = {
      paddingRight: 10
    }
    return (
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#" as="span">
              <Link style={padding} to="/">home</Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              <Link style={padding} to="/blogs">blogs</Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              <Link style={padding} to="/users">users</Link>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }

  return (
    <div className='container'>
      <Router>
         <Menu/>
         <Notification />
         {checkLogin(user)}
         <h2>Blogs App</h2>
        <Switch>
          <Route path='/users/:id'>
            <User/>
          </Route>
          <Route path='/blogs/:id'>
            <Blog user={user}/>
          </Route>
          <Route path='/blogs'>
            {checkAllowCreateNote(user)}
             <AllBlogs/>
          </Route>
          <Route path='/users'>
            <AllUsers />
          </Route>
          <Route path='/'>
            home
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App