import React from 'react'
import { deleteBlog, updateBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import CommentForm from "./CommentForm";

const Blog = ({ user }) => {

  const dispatch = useDispatch()
  const id = useParams().id
  const blog = useSelector(state => state.blogs.find(b => b.id === id))

  const handleUpdateBlog = async (blogToUpdate) => {
    try{
      await dispatch(updateBlog(blogToUpdate.id, blogToUpdate, user))
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

  const updateLikes = () => {
    const updateBlog = {...blog, likes: blog.likes + 1}
    handleUpdateBlog(updateBlog)
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

  const showComments = (comments) => {
    if (comments.length > 0)
      return(
        <div>
          <h3>Comments</h3>
          <ul>
            {comments.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>
      )
  }

  if (!blog)
    return null
  return(
    <div>
      <h2>{blog.title}</h2>
      <a href={blog.url}>{blog.url}</a>
      <div>added by {blog.author}</div>
      <div>{blog.likes} likes <button onClick={updateLikes}>likes</button></div>
      <div>{user !== null && removeButton()}</div>
      <CommentForm blog={blog}/>
      {showComments(blog.comments)}
    </div>
  )
}

Blog.displayName = 'Blog'

export default Blog