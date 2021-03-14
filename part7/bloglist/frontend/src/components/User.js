import React from "react";
import { useParams } from 'react-router-dom'
import { useSelector } from "react-redux";
import {Table} from "react-bootstrap";

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
        <Table striped>
        <thead>
        <tr>
          <th>added blogs</th>
        </tr>
        </thead>
        <tbody>
        {user.blogs.map(blog => <tr key={blog.id}><td>{blog.title}</td></tr>)}
        </tbody>
      </Table>
      </div>
    )
  }
}

export default User