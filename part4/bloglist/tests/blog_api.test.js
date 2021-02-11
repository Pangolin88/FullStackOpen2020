const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs){
      const newBlog = new Blog(blog)
      await newBlog.save()
  }
})

test('blogs are return as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('there are six blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('verify the property id', async() => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => expect(blog.id).toBeDefined())
})

test('a valid blog is added', async () => {
    const newBlog = {
        title: 'Khong qua loa 8',
        author: 'Kien Trinh',
        url: 'https://open.spotify.com/album/2GNL2QzjeqiHQ8f0auYRS8',
        likes: 10000000000
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogs = await helper.blogsInDb()
    const titles = blogs.map(b => b.title)
    expect(blogs).toHaveLength(helper.initialBlogs.length + 1)
    expect(titles).toContain('Khong qua loa 8')
})

test('if blog missing the property like, default likes equal 0', async () => {
    const newBlog = {
        title: 'Khong qua loa 8',
        author: 'Kien Trinh',
        url: 'https://open.spotify.com/album/2GNL2QzjeqiHQ8f0auYRS8'
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogs = await helper.blogsInDb()
    const blogLikes = blogs.map(b => b.likes)
    expect(blogs).toHaveLength(helper.initialBlogs.length + 1)
    expect(blogLikes[blogLikes.length - 1]).toBe(0)
})

test('blogs missing title', async () => {
    const newBlog = {
        author: 'Huynh Vi Ha',
        url: '168B Bai Say'
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    const allBlogs =  await helper.blogsInDb()
    expect(allBlogs).toHaveLength(helper.initialBlogs.length)
})

test('blogs missing url', async () => {
    const newBlog = {
        title: 'MyTee',
        author: 'Huynh Vi Ha'
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    const allBlogs =  await helper.blogsInDb()
    expect(allBlogs).toHaveLength(helper.initialBlogs.length)
})

test('blogs missing title and url', async () => {
    const newBlog = {
        author: 'Huynh Vi Ha'
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    const allBlogs = await helper.blogsInDb()
    expect(allBlogs).toHaveLength(helper.initialBlogs.length)
})


afterAll(() =>
    mongoose.connection.close()
)