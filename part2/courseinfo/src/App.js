import React from 'react'

import Courses from "./components/Courses";

const App = ( {courses} ) => {
  return (
    <div>
        <h1>Web development curriculum</h1>
        <Courses courses={courses}/>
    </div>
  )
}

export default App