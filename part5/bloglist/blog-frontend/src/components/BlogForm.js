import React from "react";

const BlogForm = ({ handleNewBlog, handleTitleChange, handleAuthorChange, handleUrlChange, title, author, url }) => {
    return(
        <div>
          <h2>Create new blog</h2>
          <form onSubmit={handleNewBlog}>
            <div>
              title:
              <input
              type="text"
              value={title}
              name="Title"
              onChange={handleTitleChange}/>
            </div>
            <div>
              author:
              <input
              type="text"
              value={author}
              name="Author"
              onChange={handleAuthorChange}/>
            </div>
            <div>
              url:
              <input
              type="text"
              value={url}
              name="URL"
              onChange={handleUrlChange}/>
            </div>
            <button type="submit" >create</button>
          </form>
        </div>
    )
  }

export default BlogForm