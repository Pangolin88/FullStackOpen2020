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
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState({message: null, isSuccess: false})

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
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

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

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

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
          'loggedNoteappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
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
          setBlogs(blogs.concat(returnedBlog))
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
          <LoginForm handleLogin={handleLogin}
                 handleUsernameChange={handleUsernameChange}
                 handlePasswordChange={handlePasswordChange}
                 username={username}
                 password={password}/>
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

  return (
    <div>
      <Notification message={status.message} isSuccess={status.isSuccess}/>
      <h2>blogs</h2>
      {checkLogin(user)}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App