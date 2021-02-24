import React from "react";
import { useDispatch } from "react-redux";
import { createAnecdote } from "../reducers/anecdoteReducer";
import anencdoteService from '../services/anecdotes'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    const newAnecdote = await anencdoteService.createNew(content)
    dispatch(createAnecdote(newAnecdote))
  }

  return (
    <form onSubmit={addAnecdote}>
      <input name='anecdote'/>
      <button type='submit'>add</button>
    </form>
  )
}

export default AnecdoteForm