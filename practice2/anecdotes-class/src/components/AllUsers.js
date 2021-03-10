import React from "react";
import { useSelector, useDispatch } from "react-redux";
import{ setInitialUsers } from '../reducers/userReducer'

const User = ({ user }) => {
  const blogs = user.blogs
  return (
    <div>
      <div>{user.username}</div>
      <div>{blogs.length}</div>
    </div>
  )
}

const AllUsers = () => {
  const dispatch = useDispatch()
  dispatch(setInitialUsers())
  const users = useSelector(state => state.users)
  return (
    <div>
      <h2>Users</h2>
      {users.map(u => <User key={u.id} user={u}/>)}
    </div>
  )
}

export default AllUsers