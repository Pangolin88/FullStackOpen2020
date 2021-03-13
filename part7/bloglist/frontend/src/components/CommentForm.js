import React, { useState } from 'react'
import { updateBlog } from "../reducers/blogReducer";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button } from 'react-bootstrap'

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
    <Form onSubmit={addComment}>
      <Form.Group>
        <Form.Label>comment</Form.Label>
        <Form.Control
          type='text'
          name='comment'
          value={comment}
          onChange={handleCommentChange}
        />
      </Form.Group>
      <Button variant='primary' type='submit'>add comment</Button>
    </Form>
  )
}

export default CommentForm