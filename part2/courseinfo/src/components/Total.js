import React from 'react'
const Total = ({ course }) => {
    const totalExercises = course.parts.reduce((sum, part) => {
        return sum + part.exercises
    }, 0)
    return(
    <div>Total of {totalExercises} exercises</div>
    )
}

export default Total
