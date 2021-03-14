import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Button } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

const BlogForm = ({ handleNewBlog }) => {
  const history = useHistory()
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

  const addBlog = (event) => {
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
    history.push('/blogs')
  }

  return(
    <div>
      <h2>Create new blog</h2>
      <Form onSubmit={addBlog}>
        <Form.Group>
          <Form.Label>title</Form.Label>
          <Form.Control
            type='text'
            name='Title'
            onChange={handleTitleChange}
          />
          <Form.Label>author</Form.Label>
          <Form.Control
            type='text'
            name='Author'
            onChange={handleAuthorChange}
          />
          <Form.Label>url</Form.Label>
          <Form.Control
            type='text'
            name='Url'
            onChange={handleUrlChange}
          />
          <Button variant='primary' type='submit'>add blog</Button>
        </Form.Group>

      </Form>
    </div>
  )
}

BlogForm.propTypes = {
  handleNewBlog: PropTypes.func.isRequired
}

BlogForm.displayName = 'BlogForm'

export default BlogForm