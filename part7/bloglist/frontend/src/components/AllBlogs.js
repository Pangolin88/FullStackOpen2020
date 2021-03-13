import React from "react";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'

const AllBlogs = () => {
  const blogs = useSelector(state => state.blogs)
  return(
    <div>
      <Table striped>
        <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
        </tr>
        </thead>
        <tbody>
        {blogs
            .sort((a, b) => b.likes - a.likes)
            .map(blog =>
              <tr key={blog.id}>
                <td> <Link to={`blogs/${blog.id}`}>{blog.title}</Link></td>
                <td>{blog.author}</td>
              </tr>
          )}
        </tbody>
      </Table>
    </div>
    )
}

export default AllBlogs