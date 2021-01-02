import React from 'react'
import ReactDOM from 'react-dom'

const App = () => {
  // const-definitions
    const course = 'Half Stack application development'
    const part1 = 'Fundamentals of React'
    const exercises1 = 10
    const part2 = 'Using props to pass data'
    const exercises2 = 7
    const part3 = 'State of a component'
    const exercises3 = 14
    const Header = (props) => {
        return(
            <div>
                <h1>
                    {props.course}
                </h1>
            </div>
        )
    }

    const Contain = (props) => {
        return(
        <div>
            <p>{props.part} {props.excercises}</p>
        </div>
        )
    }

    const Total = (props) => {

        return(
            <div>
                <p>
                    Number of excercises {props.excercises1 + props.excercises2 + props.excercises3}
                </p>
            </div>
        )
    }
  return (
    <div>
      <Header course={course} />
      <Contain part={part1} excercises={exercises1}/>
      <Contain part={part2} excercises={exercises2}/>
      <Contain part={part3} excercises={exercises3}/>
      <Total excercises1={exercises1} excercises2={exercises2} excercises3={exercises3} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))

