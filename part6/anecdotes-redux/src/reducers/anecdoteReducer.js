import anecdoteService from '../services/anecdotes'

const anecdoteReducer = (state = [], action) => {
  console.log('state now: ', state)
  console.log('action', action)

  switch (action.type) {
    case 'CREATE':
      return [...state, action.data]
    case 'INIT':
      return action.data
    case 'VOTE':
      return state.map(anecdote => anecdote.id === action.data.id ? action.data : anecdote)
    default:
      return state
  }
}

export const initialAnecdotes = () => {
  return async dispatch => {
    const anecdote = await anecdoteService.getAll()
    dispatch({
      type: 'INIT',
      data: anecdote
    })
  }
}

export const createAnecdote = (content) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch({
      type: 'CREATE',
      data: newAnecdote
    })
  }
}

export const updateVote = (id) => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    const anecdoteToUpdate = anecdotes.find(anecdote => anecdote.id === id)
    const updatedAnecdote = await anecdoteService.update(id, anecdoteToUpdate)
    dispatch({
      type: 'VOTE',
      data: updatedAnecdote
    })
  }
}

export default anecdoteReducer