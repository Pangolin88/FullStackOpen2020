import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateVote } from '../reducers/anecdoteReducer'
import { changeNotification } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <li key={anecdote.id}>
      <div>
        {anecdote.content}
      </div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </li>
  )
}

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const handleClick = (anecdote) => {
    dispatch(updateVote(anecdote.id))
    dispatch(changeNotification(`you voted '${anecdote.content}'`))
    setTimeout(() => dispatch(changeNotification('')), 5000)
  }
  const anecdotes = useSelector(state => state.anecdotes.sort((a, b) => b.votes - a.votes))
  return (
    <ul>
      {anecdotes.map(anecdote =>
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => handleClick(anecdote)}
        />
      )}
    </ul>
  )
}

export default AnecdoteList
