import React from "react";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom'
import {Table} from "react-bootstrap";


const User = ({ user }) => {
  let len
  if (!user.blogs){
    len = 0
  }
  else{
    len = user.blogs.length
  }
  return(
    <tr key={user.id}>
      <td><Link to={`users/${user.id}`}>{user.username}</Link></td>
      <td>{len}</td>
    </tr>
  )
}

const AllUsers = () => {
  const users = useSelector(state => state.users)
  return (
    <div>
      <h2>Users</h2>
      <Table striped>
        <thead>
        <tr>
          <th></th>
          <th>blog created</th>
        </tr>
        </thead>
        <tbody>
         {users.map(u => <User key={u.id} user={u}/>)}
        </tbody>
      </Table>
    </div>
  )
}

export default AllUsers