import React, {useState} from "react";

const Blog = ({ blog, user, handleUpdateBlog, handleRemoveBlog }) => {
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

  const updateLikes = () => {
      const updateBlog = blog
      updateBlog.likes = updateBlog.likes + 1
      handleUpdateBlog(updateBlog)
      setLikes(likes + 1)
  }
  
  const removeBlog = () => {
      if (window.confirm(`Comfirm remove ${blog.title}`)) {
        handleRemoveBlog(blog)
        }
  }

  const removeButton = () => {
      if (user.username === blog.user.username)
          return(
              <button onClick={removeBlog}>Remove</button>
          )
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
             <div>likes {likes} <button onClick={updateLikes}>like</button></div>
             <div>{blog.author}</div>
             <div>{user !== null && removeButton()}</div>
      </div>
    )

}

export default Blog