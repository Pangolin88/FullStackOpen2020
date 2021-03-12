import blogService from '../services/blogs'

const blogReducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_BLOG':
      return action.data
    case 'CREATE':
      return [...state, action.data]
    case 'DELETE':
      return state.filter(s => s.id !== action.data)
    case 'UPDATE':
      return state.map(s => s.id === action.id ? action.data : s)
    default:
      return state
  }
}

export const initialBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOG',
      data: blogs
    })
  }
}

export const createNewBlog = (newBlog, user) => {
  return async dispatch => {
    const returnedBlog = await blogService.create(newBlog)
    const blog = {...returnedBlog, user: user}
    dispatch({
      type: 'CREATE',
      data: blog
    })
  }
}

export const deleteBlog = (id) => {
  return async dispatch => {
    await blogService.remove(id)
    dispatch({
      type: 'DELETE',
      data: id
    })
  }
}

export const updateBlog = (id, blogToUpdate, user) => {
  return async dispatch => {
    const returnedBlog = await blogService.update(id, blogToUpdate)
    const blog = {...returnedBlog, user: user}
    dispatch({
      type: 'UPDATE',
      data: blog,
      id: id
    })
  }
}

export default blogReducer