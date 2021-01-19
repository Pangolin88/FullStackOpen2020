import React from 'react'

import Header from "./Header";
import Total from "./Total";
import Content from "./Content";

const Courses = ( {courses} ) => {
  return (
    <div>
        {courses.map((course) => {
            return(
                <div key={course.id}>
                    <Header course={course}/>
                    <Content course={course}/>
                    <Total course={course}/>
                </div>
            )
            }
        )}
    </div>
  )
}

export default Courses