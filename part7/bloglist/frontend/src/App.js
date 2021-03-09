import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import loginService from './services/login'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LogoutButton from './components/LogoutButton'
import Toggleable from './components/Toggleable'
import { setNotification  } from './reducers/notificationReducer'
import { useDispatch } from "react-redux";

const App = () => {
  const dispatch = useDispatch()
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      dispatch(setNotification ('login successfully', true, 5))
    } catch (exception) {
      dispatch(setNotification ('invalid username or password', false, 5))
    }
  }

  const handleLogout =  () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    dispatch(setNotification ('logout successfully', true, 5))
  }

  const handleNewBlog = async (newBlog) => {
    try{
      const returnedBlog = await blogService.create(newBlog)
      const updatedBlogs = await blogService.getAll()
      setBlogs(updatedBlogs)
      if (newBlog.author)
        dispatch(setNotification (`a new blog ${returnedBlog.title} by ${returnedBlog.author}`, true, 5))
      else
       dispatch(setNotification (`a new blog ${returnedBlog.title}`, true, 5))
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

  const handleUpdateBlog = async (updateBlog) => {
    try{
      const returnedBlog = await blogService.update(updateBlog.id, updateBlog)
      console.log(returnedBlog)
      const updateBlogs = blogs.map(blog => blog.id === returnedBlog.id ? updateBlog : blog)
      setBlogs(updateBlogs)

    }catch (exception) {
      console.log(exception)
    }
  }

  const handleRemoveBlog = async (removeBlog) => {
    try{
      const returnedBlog = await blogService.remove(removeBlog.id)
      console.log(returnedBlog)
      const updateBlogs = blogs.filter(blog => blog.id !== removeBlog.id)
      setBlogs(updateBlogs)
    }catch (exception) {
      console.log(exception)
    }
  }

  return (
    <div id='body'>
      <Notification />
      <h2>blogs</h2>
      {checkLogin(user)}
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
        <Blog key={blog.id} blog={blog} user={user} handleUpdateBlog={handleUpdateBlog} handleRemoveBlog={handleRemoveBlog}/>
      )}
    </div>
  )
}

export default App