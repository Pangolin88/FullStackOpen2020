const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {'username': 1})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  if (!request.body.title || !request.body.url)
      return response.status(400).end()

  const user = await User.findById(request.body.userId)
  const blog = new Blog(request.body)

  blog.user = user._id
  if (!blog.likes)
      blog.likes = 0

  const addedBlog = await blog.save()

  user.blogs = user.blogs.concat(addedBlog._id)
  user.save()

  response.status(201).json(addedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async(request, response) => {
    const blog = {
        likes: request.body.likes
    }
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
    response.json(updatedBlog)
})

module.exports = blogsRouter