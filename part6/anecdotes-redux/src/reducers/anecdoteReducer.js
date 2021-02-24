const anecdoteReducer = (state = [], action) => {
  console.log('state now: ', state)
  console.log('action', action)

  switch (action.type) {
    case 'CREATE':
      return [...state, action.data]
    case 'INIT':
      return action.data
    case 'VOTE':
      const anecdoteToUpdate = state.find(anecdote => anecdote.id === action.data.id)
      const updatedAnecdote = {...anecdoteToUpdate, votes: anecdoteToUpdate.votes + 1}
      console.log(updatedAnecdote)
      return state.map(anecdote => anecdote.id === action.data.id ? updatedAnecdote : anecdote)
    default:
      return state
  }
}

export const initialAnecdotes = (data) => {
  return{
    type: 'INIT',
    data,
  }
}

export const createAnecdote = (data) => {
  return {
    type: 'CREATE',
    data,
  }
}

export const updateVote = (id) => {
  return {
    type: 'VOTE',
    data: {id}
  }
}

export default anecdoteReducer