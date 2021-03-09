import blogService from '../services/blogs'

const blogReducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT':
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

export const setInitialBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT',
      data: blogs
    })
  }
}

export const createNewBlog = (newBlog) => {
  return async dispatch => {
    const returnedBlog = await blogService.create(newBlog)
    dispatch({
      type: 'CREATE',
      data: returnedBlog
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

export const updateBlog = (id, blogToUpdate) => {
  return async dispatch => {
    await blogService.update(id, blogToUpdate)
    dispatch({
      type: 'UPDATE',
      data: blogToUpdate,
      id: id
    })
  }
}

export default blogReducer