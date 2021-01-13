import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Header = ({ header }) => <h2>{header}</h2>

const Button = ({ handleClick, text }) => {
    return(
        <button onClick={handleClick}>
          {text}
        </button>
    )
}

const Statistic = ({ text, value }) => {
  return(
      <tr>
        <td>{text}</td>
        <td>{value}</td>
      </tr>
    )
}

const Statistics = ({ good, neutral, bad }) => {
    if (good + bad + neutral === 0){
        return (<p>No feedback given</p>)
    }
    const all = good + neutral + bad
    const average = ((good - bad)/all).toFixed(1)
    const positive = (good*100/all).toFixed(1)
    return (
        <div>
        <Statistic text="good" value={good}/>
        <Statistic text="neutral" value={neutral}/>
        <Statistic text="bad" value={bad}/>
        <Statistic text="all" value={all}/>
        <Statistic text="average" value={average}/>
        <Statistic text="positive" value={positive + " %"}/>
        </div>
    )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Header header="give feedback" />
      <Button handleClick={() => setGood(good + 1)} text="good"/>
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral"/>
      <Button handleClick={() => setBad(bad + 1)} text="bad"/>
      <Header header="statistics"/>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

ReactDOM.render(<App />,
  document.getElementById('root')
)