import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import loginService from './services/login'
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState({message: '', isSuccess: false})

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
    } catch (exception) {
      console.log(exception)
    }
  }

  const handleLogout =  () => {
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
  }

  const handleNewBlog = async (event) => {
    event.preventDefault()
    console.log(title, author, url)
    const newBlog = {
      title: title,
      author: author,
      url: url
    }
    const returnedBlog = await blogService.create(newBlog)
    console.log(returnedBlog)
    setBlogs(blogs.concat(returnedBlog))
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const blogForm = () => {
    return(
        <div>
          <h2>Create new blog</h2>
          <form onSubmit={handleNewBlog}>
            <div>
              title:
              <input
              type="text"
              value={title}
              name="Title"
              onChange={({target}) => setTitle(target.value)}/>
            </div>
            <div>
              author:
              <input
              type="text"
              value={author}
              name="Author"
              onChange={({target}) => setAuthor(target.value)}/>
            </div>
            <div>
              url:
              <input
              type="text"
              value={url}
              name="URL"
              onChange={({target}) => setUrl(target.value)}/>
            </div>
            <button type="submit" >create</button>
          </form>
        </div>
    )
  }

  const loginForm = () => {
    return(
        <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    )
  }

  const logoutButton = () => {
    return(
        <div>
           {user.name} logged in
           <button onClick={handleLogout}>logout</button>
        </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      {user === null && loginForm()}
      {user !== null && logoutButton()}
      {user !== null && blogForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App