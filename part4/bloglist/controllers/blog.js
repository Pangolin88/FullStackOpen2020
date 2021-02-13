const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')){
        return authorization.substring(7)
    }
    return null
}

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {'username': 1})
    response.json(blogs)
})


blogsRouter.post('/', async (request, response) => {
  const body = request.body
  if (!body.title || !body.url)
      return response.status(400).end()

  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || ! decodedToken.id)
      return response.status(401).json({error: 'token missing or invalid'})

  const user = await User.findById(decodedToken.id)
  const blog = new Blog(body)
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