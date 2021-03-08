const blogReducer = (state = [], action) => {
  switch (action.type) {
    case 'NEw_BLOG':
      return [...state, action.data]
    case 'REMOVE':
      const removedBlogs = state.filter(blog => blog.id !== action.data.id)
      return removedBlogs
    default:
      return state
  }
}
