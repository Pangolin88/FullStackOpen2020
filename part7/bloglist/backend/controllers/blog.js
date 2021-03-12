const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
      .populate('user', {'username': 1})
    response.json(blogs)
})


blogsRouter.post('/:id/comment', async(request, response) => {
  const blog = await Blog.findById(request.params.id)
  const lstComments = [...blog.comments, request.body.content]
  const addedCommentBlog = blog
  addedCommentBlog.comments = lstComments
  await addedCommentBlog.save()
  response.json(addedCommentBlog)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  if (!body.title || !body.url)
      return response.status(400).json({error: 'title or url is missing'})

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id)
      return response.status(401).json({error: 'token missing or invalid'})
  const user = await User.findById(decodedToken.id)

  const blog = new Blog(body)
  blog.user = user._id
  if (!blog.likes)
      blog.likes = 0

  const addedBlog = await blog.save()
  user.blogs = user.blogs.concat(addedBlog._id)
  await user.save()
  response.status(201).json(addedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if(!request.token || !decodedToken.id)
        return response.status(401).json({error: 'token missing or invalid'})

    const deletedBlog = await Blog.findByIdAndRemove(request.params.id)
    console.log('deletedBlog: ', deletedBlog)
    if (deletedBlog.user) {
        const user = await User.findById(deletedBlog.user.toString())
        if (user.blogs)
            user.blogs = user.blogs.remove(deletedBlog._id)
        await user.save()
    }
    response.status(204).end()
})


blogsRouter.put('/:id', async(request, response) => {
    const blog = {
      likes: request.body.likes,
      comments: request.body.comments,
    }
    console.log(blog)
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
    response.json(updatedBlog)
})

module.exports = blogsRouter