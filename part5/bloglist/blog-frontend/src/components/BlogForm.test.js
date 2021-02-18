import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', () => {
  const createBlog = jest.fn()

  const component = render(
    <BlogForm handleNewBlog={createBlog} />
  )

  const author = component.container.querySelector('#author')
  const title = component.container.querySelector('#title')
  const url = component.container.querySelector('#url')
  const form = component.container.querySelector('form')

  fireEvent.change(author, {
    target: { value: 'Thinh Suy' }
  })
  fireEvent.change(title, {
    target: { value: 'Tinh yeu xanh la' }
  })
  fireEvent.change(url, {
    target: { value: 'https://www.youtube.com/watch?v=x-g1o_tkLj4' }
  })
  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Tinh yeu xanh la')
  expect(createBlog.mock.calls[0][0].author).toBe('Thinh Suy')
  expect(createBlog.mock.calls[0][0].url).toBe('https://www.youtube.com/watch?v=x-g1o_tkLj4')
})