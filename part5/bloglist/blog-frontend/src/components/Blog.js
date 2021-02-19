import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, user, handleUpdateBlog, handleRemoveBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [showDetail, setShowDetail] = useState(false)
  const [likes, setLikes]  = useState(blog.likes)

  const toggleShowBlog = () => {
    setShowDetail(!showDetail)
  }
  const updateLikes = () => {
    const updateBlog = blog
    updateBlog.likes = updateBlog.likes + 1
    handleUpdateBlog(updateBlog)
    setLikes(likes + 1)
  }

  const removeBlog = () => {
    if (window.confirm(`Confirm remove ${blog.title}`)) {
      handleRemoveBlog(blog)
    }
  }

  const removeButton = () => {
    if (user.username === blog.user.username)
      return(
        <button onClick={removeBlog}>Remove</button>
      )
  }
  if (!showDetail)
    return(
      <div style={blogStyle} className='bloghide'>
        {blog.title} {blog.author} <button onClick={toggleShowBlog}>view</button>
      </div>
    )
  else
    return(
      <div style={blogStyle} className='blogshow'>
        <div>{blog.title} <button onClick={toggleShowBlog}>hide</button></div>
        <div>{blog.url}</div>
        <div className='likes'>likes {likes} <button id='like-button' onClick={updateLikes}>like</button></div>
        <div>{blog.author}</div>
        <div>{user !== null && removeButton()}</div>
      </div>
    )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  handleUpdateBlog: PropTypes.func.isRequired,
  handleRemoveBlog: PropTypes.func.isRequired
}

Blog.displayName = 'Blog'

export default Blog