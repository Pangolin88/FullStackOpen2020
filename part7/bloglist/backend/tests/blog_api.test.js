const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const jwt = require('jsonwebtoken')

const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs){
      const newBlog = new Blog(blog)
      await newBlog.save()
  }
})

describe('when there is initially some blogs saved', () => {
    test('blogs are return as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('there is number of blogs', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('verify the property id', async () => {
        const response = await api.get('/api/blogs')
        response.body.forEach(blog => expect(blog.id).toBeDefined())
    })
})

describe('add new blog', () => {
    test('a valid blog is added', async () => {
        const userForToken = {
            username: "root",
            id: "6028a121952d0d753e55ff9b"
        }
        const token = jwt.sign(userForToken, process.env.SECRET)

        const newBlog = {
            title: 'Khong qua loa 8',
            author: 'Kien Trinh',
            url: 'https://open.spotify.com/album/2GNL2QzjeqiHQ8f0auYRS8',
            likes: 10000000000
        }
        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogs = await helper.blogsInDb()
        const titles = blogs.map(b => b.title)
        expect(blogs).toHaveLength(helper.initialBlogs.length + 1)
        expect(titles).toContain('Khong qua loa 8')
    })

    test('if blog missing the property likes, default likes equal 0', async () => {
         const userForToken = {
            username: "root",
            id: "6028a121952d0d753e55ff9b"
        }
        const token = jwt.sign(userForToken, process.env.SECRET)

        const newBlog = {
            title: 'Khong qua loa 8',
            author: 'Kien Trinh',
            url: 'https://open.spotify.com/album/2GNL2QzjeqiHQ8f0auYRS8'
        }
        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogs = await helper.blogsInDb()
        const blogLikes = blogs.map(b => b.likes)
        expect(blogs).toHaveLength(helper.initialBlogs.length + 1)
        expect(blogLikes[blogLikes.length - 1]).toBe(0)
    })
})


describe ('add blog with missing required properties', () => {
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

    test('missing authorization', async () => {
        const newBlog = {
            title: 'Khong qua loa 8',
            author: 'Kien Trinh',
            url: 'https://open.spotify.com/album/2GNL2QzjeqiHQ8f0auYRS8',
            likes: 10000000000
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)

        const blogs = await helper.blogsInDb()
        expect(blogs).toHaveLength(helper.initialBlogs.length)
    })

    test('authorization provides wrong token', async () => {
        const newBlog = {
            title: 'Khong qua loa 8',
            author: 'Kien Trinh',
            url: 'https://open.spotify.com/album/2GNL2QzjeqiHQ8f0auYRS8',
            likes: 10000000000
        }
        await api
            .post('/api/blogs')
            .set('Authorization', 'wrong token')
            .send(newBlog)
            .expect(401)

        const blogs = await helper.blogsInDb()
        expect(blogs).toHaveLength(helper.initialBlogs.length)
    })
})


describe ('delete a blog', () => {
    test('delete blog', async () => {
        const userForToken = {
            username: "root",
            id: "6028a121952d0d753e55ff9b"
        }
        const token = jwt.sign(userForToken, process.env.SECRET)

        const blogAtStart = await helper.blogsInDb()
        const blogToDelete = blogAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

        const titles = blogsAtEnd.map(b => b.title)
        expect(titles).not.toContain(blogToDelete.title)
    })

    test('delete blog but do not provide authorization', async () => {
        const blogAtStart = await helper.blogsInDb()
        const blogToDelete = blogAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(401)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('delete blog but provide wrong authorization', async () => {
        const blogAtStart = await helper.blogsInDb()
        const blogToDelete = blogAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', 'wrong token')
            .expect(401)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
})

describe('update blog', () => {
    test('update number of likes', async () => {
        let allBlogs = await helper.blogsInDb()
        let blogToUpdate = allBlogs[0]
        blogToUpdate.likes = blogToUpdate.likes + 100

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(blogToUpdate)
            .expect(200)

        allBlogs = await helper.blogsInDb()
        const updatedBlog = allBlogs[0]
        expect(updatedBlog.likes).toBe(blogToUpdate.likes)

    })
})

afterAll(() =>
    mongoose.connection.close()
)