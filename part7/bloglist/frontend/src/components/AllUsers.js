import React from "react";
import { useSelector } from "react-redux";


const User = ({ username, blogs }) => {
  let len = 0
  if (!blogs){
    len = 0
  }
  else{
    len = blogs.length
  }
  return(
    <tr>
      <td>{username}</td>
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
        {users.map(u => <User username={u.username} blogs={u.blogs}/>)}
      </table>
    </div>
  )
}

export default AllUsers