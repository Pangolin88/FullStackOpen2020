import React from "react";
import { useSelector } from "react-redux";


const User = ({ username, blogs }) => {
  return(
    <div>
      <p>{username}  {blogs.length}</p>
    </div>
  )
}

const AllUsers = () => {
  const users = useSelector(state => state.users)
  return (
    <div>
      {users.map(u => <User username={u.username} len={u.blogs}/>)}
    </div>
  )
}

export default AllUsers