import React from "react";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom'


const User = ({ user }) => {
  let len = 0
  if (!user.blogs){
    len = 0
  }
  else{
    len = user.blogs.length
  }
  return(
    <tr>
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
      <table>
        <tr>
          <td></td>
          <td><strong>blog created</strong></td>
        </tr>
        {users.map(u => <User user={u}/>)}
      </table>
    </div>
  )
}

export default AllUsers