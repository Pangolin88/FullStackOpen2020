import React, { useState } from 'react'
import { updateBlog } from "../reducers/blogReducer";
import { useDispatch, useSelector } from "react-redux";

const CommentForm = ({ blog }) => {
  const [comment, setComment] = useState('')
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  const handleCommentChange = (event) => {
    setComment(event.target.value)
  }

  const addComment = async (event) => {
    event.preventDefault()
    const blogToUpdate = {...blog, comments: blog.comments.concat(comment)}
    await dispatch(updateBlog(blogToUpdate.id, blogToUpdate, user))
    setComment('')
  }

  return(
    <form onSubmit={addComment}>
      <input
        id='comment'
        type='text'
        value={comment}
        name='comment'
        onChange={handleCommentChange}/>
      <button type = 'submit'>add comment</button>
    </form>
  )
}

export default CommentForm