import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import loginService from './services/login'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LogoutButton from './components/LogoutButton'
import Toggleable from './components/Toggleable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState({ message: null, isSuccess: false })


  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort( (a, b) => {
        return b.likes - a.likes
      })
      )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleStatus = (message, isSuccess) => {
    setStatus({
      message: message,
      isSuccess: isSuccess
    })
    setTimeout(() => {
      setStatus({
        message: null,
        isSuccess: false
      })
    }, 3000)
  }

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      handleStatus('login successfully', true)
    } catch (exception) {
      handleStatus('invalid username or password', false)
    }
  }

  const handleLogout =  () => {
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
    handleStatus('logout successfully', true)
  }

  const handleNewBlog = async (newBlog) => {
    try{
      const returnedBlog = await blogService.create(newBlog)
      console.log(returnedBlog)
      // setBlogs(blogs.concat(returnedBlog))
      blogService.getAll().then(blogs =>
        setBlogs(blogs.sort( (a, b) => {
          return b.likes - a.likes
        })
        )
      )
      if (newBlog.author)
        handleStatus(`a new blog ${returnedBlog.title} by ${returnedBlog.author}`, true)
      else
        handleStatus(`a new blog ${returnedBlog.title}`, true)
      blogFormRef.current.toggleVisibility()
    }catch (exception) {
      if (!newBlog.title || !newBlog.url)
        handleStatus('missing title or url', false)
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
      blogService.getAll().then(blogs =>
        setBlogs(blogs.sort( (a, b) => {
          return b.likes - a.likes
        }))
      )
    }catch (exception) {
      console.log(exception)
    }
  }

  const handleRemoveBlog = async (removeBlog) => {
    try{
      const returnedBlog = await blogService.remove(removeBlog.id)
      console.log(returnedBlog)
      blogService.getAll().then(blogs =>
        setBlogs(blogs.sort( (a, b) => {
          return b.likes - a.likes
        })
        ))
    }catch (exception) {
      console.log(exception)
    }
  }

  return (
    <div>
      <Notification message={status.message} isSuccess={status.isSuccess}/>
      <h2>blogs</h2>
      {checkLogin(user)}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} user={user} handleUpdateBlog={handleUpdateBlog} handleRemoveBlog={handleRemoveBlog}/>
      )}
    </div>
  )
}

export default App