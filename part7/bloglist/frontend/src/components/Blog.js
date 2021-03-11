import React, { useState } from 'react'
import { deleteBlog, updateBlog } from "../reducers/blogReducer";
import { setNotification } from "../reducers/notificationReducer";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom'


const Blog = ({ user }) => {
  const dispatch = useDispatch()
  const id = useParams().id
  const blog = useSelector(state => state.blogs.find(b => b.id === id))

  const handleUpdateBlog = async (blogToUpdate) => {
    try{
      await dispatch(updateBlog(blogToUpdate.id, blogToUpdate))
    }catch (exception) {
      console.log(exception)
    }
  }

  const handleRemoveBlog = async (removeBlog) => {
    try{
      await dispatch(deleteBlog(removeBlog.id))
      dispatch(setNotification (`deleted a blog`, true, 5))
    }catch (exception) {
      console.log(exception)
    }
  }

  const [likes, setLikes]  = useState(blog.likes)
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
        <button id='delete-button' onClick={removeBlog}>Remove</button>
      )
  }

  return(
    <div>
      <h2>{blog.title}</h2>
      <div>{blog.url}</div>
      <div>added by {blog.author}</div>
      <div>{blog.likes} likes <button onClick={updateLikes}>likes</button></div>
      <div>{user !== null && removeButton()}</div>
    </div>
  )
}

Blog.displayName = 'Blog'

export default Blog