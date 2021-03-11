import React from "react";
import { useParams } from 'react-router-dom'
import { useSelector } from "react-redux";

const User = () => {
  const id = useParams().id
  const user = useSelector(state => state.users.find(u => u.id === id))
  if (!user)
    return null
  if (user.blogs.length === 0){
    return(
      <div>
        <h2>{user.username}</h2>
        user hasn't created any blog...
      </div>
    )
  }
  else {
    return (
      <div>
        <h2>{user.username}</h2>
        <h3>added blogs</h3>
        <ul>
          {user.blogs.map(blog => <li key={blog.id}>{blog.title}</li>)}
        </ul>
      </div>
    )
  }
}

export default User