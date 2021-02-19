import React, { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ handleNewBlog }) => {
  const [title, setTitle] = useState('')

  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setUrl(event.target.value)
  }

  const addBlog = async (event) => {
    event.preventDefault()
    const newBlog = {
      title: title,
      author: author,
      url: url
    }

    handleNewBlog(newBlog)
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return(
    <div>
      <h2>Create new blog</h2>
      <form onSubmit={addBlog}>
        <div>
            title:
          <input
            id='title'
            type='text'
            value={title}
            name='Title'
            onChange={handleTitleChange}/>
        </div>
        <div>
            author:
          <input
            id='author'
            type='text'
            value={author}
            name='Author'
            onChange={handleAuthorChange}/>
        </div>
        <div>
             url
          <input
            id='url'
            type='text'
            value={url}
            name='URL'
            onChange={handleUrlChange}/>
        </div>
        <button id='create-button' type='submit' >create</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  handleNewBlog: PropTypes.func.isRequired
}

BlogForm.displayName = 'BlogForm'

export default BlogForm