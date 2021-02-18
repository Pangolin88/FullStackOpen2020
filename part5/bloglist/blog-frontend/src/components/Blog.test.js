import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Togglable />', () => {
  const user = null

  const blog = {
      title: 'Tinh yeu xanh la',
      author: 'Thinh Suy',
      url: 'https://www.youtube.com/watch?v=x-g1o_tkLj4',
      user: user
    }

  let component

  const mockUpdateBlog = jest.fn()

  beforeEach(() => {
    component = render(
      <Blog blog={blog} user={user} handleUpdateBlog={mockUpdateBlog}/>
    )
  })

  test('renders content', () => {
    const div = component.container.querySelector('.bloghide')
    expect(div).toHaveTextContent(
      'Tinh yeu xanh la Thinh Suy'
    )
  })

  test('renders content when click button show', () => {
    const button = component.getByText('view')
    fireEvent.click(button)
    const div = component.container.querySelector('.blogshow')
    expect(div).toBeDefined()
    expect(div).toHaveTextContent(
      'https://www.youtube.com/watch?v=x-g1o_tkLj4'
    )
  })

   test('renders content when click button hide', () => {
     const button = component.getByText('view')
     fireEvent.click(button)
     const hideButton = component.getByText('hide')
     fireEvent.click(hideButton)
     const div = component.container.querySelector('.bloghide')
     expect(div).toHaveTextContent(
      'Tinh yeu xanh la Thinh Suy'
     )
  })

  test('click the like button twice', () => {
    const button = component.getByText('view')
    fireEvent.click(button)
    const likeButton = component.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)
    expect(mockUpdateBlog.mock.calls).toHaveLength(2)
  })

})