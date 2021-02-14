const _ = require('lodash');

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item
  }

  return blogs.map(blog => blog.likes).reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (previousBlog, currentBlog) => {
    return previousBlog.likes > currentBlog.likes
        ? previousBlog
        : currentBlog
  }

  const blog = blogs.reduce(reducer, blogs[0])

  return {
    title: blog.title,
    author: blog.author,
    likes: blog.likes
  }
}

const mostBlogs = (blogs) => {
  return _(blogs).groupBy('author')
          .map((objs, key) => ({
            author: key,
            blogs: objs.length
          }))
          .maxBy('blogs')
}

const mostLikes = (blogs) => {
  return _(blogs).groupBy('author')
          .map((objs, key) => ({
            author: key,
            likes: _.sumBy(objs, 'likes')
          }))
          .maxBy('likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
