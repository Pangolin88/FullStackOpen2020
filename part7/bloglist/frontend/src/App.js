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
import { useDispatch, useSelector } from "react-redux";
import { setInitialBlogs, createNewBlog, deleteBlog, updateBlog } from "./reducers/blogReducer";

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setInitialBlogs())
  }, [dispatch])

  const blogs = useSelector(state => state.blogs)
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

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
      dispatch(createNewBlog(newBlog))
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

  const handleUpdateBlog = async (blogToUpdate) => {
    try{
      dispatch(updateBlog(blogToUpdate.id, blogToUpdate))
    }catch (exception) {
      console.log(exception)
    }
  }

  const handleRemoveBlog = async (removeBlog) => {
    try{
      dispatch(deleteBlog(removeBlog))
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