import React from "react";
import Blog from "./Blog";
import { useSelector } from "react-redux";

const Home = () => {
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  return(
    <div>
      {blogs
          .sort((a, b) => b.likes - a.likes)
          .map(blog =>
          <Blog key={blog.id} blog={blog} user={user}/>
        )}
    </div>
    )
}

export default Home