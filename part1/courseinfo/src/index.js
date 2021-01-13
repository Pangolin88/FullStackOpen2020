import React from 'react'
import ReactDOM from 'react-dom'

const Header = ({ course }) => <h2>{course.name}</h2>
const Part = ({ name, excercise }) => <div>{name} {excercise}</div>
const Content = ( { course } ) => {
    return(
        <div>
            <Part name={course.parts[0].name} excercise={course.parts[0].exercises}/>
            <Part name={course.parts[1].name} excercise={course.parts[1].exercises}/>
            <Part name={course.parts[2].name} excercise={course.parts[2].exercises}/>
        </div>
    )
}
const Total = ({ course}) => <div>Number of exercises {course.parts[0].exercises + course.parts[1].exercises + course.parts[2].exercises}</div>

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course}/>
      <Content course={course}/>
      <Total course={course}/>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))