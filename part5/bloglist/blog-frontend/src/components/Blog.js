import React, {useState} from "react";

const Blog = ({ blog, handleUpdateBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [showDetail, setShowDetail] = useState(false)
  const [likes, setLikes]  = useState(blog.likes)
  const toggleShowBlog = () => {
    setShowDetail(!showDetail)
  }

  const increaseLikes = () => {
      const updateBlog = blog
      updateBlog.likes = updateBlog.likes + 1
      handleUpdateBlog(updateBlog)
      setLikes(likes + 1)
  }

  if (!showDetail)
    return(
        <div style={blogStyle}>
            {blog.title} {blog.author} <button onClick={toggleShowBlog}>view</button>
       </div>
    )
  else
    return(
        <div style={blogStyle}>
             <div>{blog.title} <button onClick={toggleShowBlog}>hide</button></div>
             <div>{blog.url}</div>
             <div>likes {likes} <button onClick={increaseLikes}>like</button></div>
             <div>{blog.author}</div>
      </div>
    )

}

export default Blog