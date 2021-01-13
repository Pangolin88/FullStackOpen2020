import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = ( {handleClick, text} ) => {
    return(
        <button onClick={handleClick}>
            {text}
        </button>
    )
}

const Display = ( {header, anecdote, vote} ) => {
    return(
        <div>
            <h2>{header}</h2>
            <p>{anecdote}</p>
            <p>has {vote} votes</p>
        </div>
    )
}

const App = (props) => {
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array.apply(null, new Array(anecdotes.length)).map(Number.prototype.valueOf,0))

  const handleVote  = () => {
    const updateVote = [...votes]
    updateVote[selected] += 1
    return setVotes(updateVote)
  }

  const handleNextAnecdote  = () => {
    const randomNumber = Math.floor(Math.random() * anecdotes.length)
    return setSelected(randomNumber)
  }

  const getIndexMaxVote = () => {
      let index = votes.indexOf(Math.max(...votes))
      return index
  }
  console.log(votes)

  return (
    <div>
        <Display header="Anecdote of the day" anecdote={anecdotes[selected]} vote={votes[selected]} />
        <Button handleClick={handleVote} text="vote" />
        <Button handleClick={handleNextAnecdote} text="next anecdote" />
        <p>{props.anecdotes[getIndexMaxVote()]}</p>
        <Display header="Anecdote with most votes" anecdote={anecdotes[getIndexMaxVote()]} vote={votes[getIndexMaxVote()]} />
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)