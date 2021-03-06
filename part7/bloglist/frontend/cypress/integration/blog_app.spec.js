describe('Note app',  function() {

  beforeEach(function() {
    localStorage.removeItem('loggedBlogappUser')
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Huynh Vi Ha',
      username: 'pangolin',
      password: 'meowmeow'
    }
    const user2 = {
      name: 'Nguyen Tuyet Nhi',
      username: 'nhinhu',
      password: 'pleupleu'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.request('POST', 'http://localhost:3001/api/users/', user2)
    cy.visit('http://localhost:3000')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('pangolin')
      cy.get('#password').type('meowmeow')
      cy.get('#login-button').click()
      cy.contains('Huynh Vi Ha logged in')
      cy.contains('create new blog')
    })

    it('fails with wrong credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('pangolin')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()
      cy.get('.error')
        .should('contain', 'invalid username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
      cy.get('html').should('not.contain', 'Huynh Vi Ha logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({username: 'pangolin', password: 'meowmeow'})
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('#title').type('Nang tho')
      cy.get('#author').type('Hoang Dung')
      cy.get('#url').type('https://www.youtube.com/watch?v=Zzn9-ATB9aU')
      cy.get('#create-button').click()
      cy.get('.success')
        .should('contain', 'a new blog Nang tho by Hoang Dung')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
        .and('have.css', 'border-style', 'solid')
      cy.contains('Nang tho Hoang Dung')
      cy.contains('view')
    })

    describe('some blogs are added', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'Nang tho',
          author: 'Hoang Dung',
          url: 'https://www.youtube.com/watch?v=Zzn9-ATB9aU'
        })
        cy.createBlog({
          title: 'Mot ngay',
          author: 'Kien Trinh',
          url: 'https://www.youtube.com/watch?v=3HD8Zws8pSs'
        })
        cy.createBlog({
          title: 'Thien ha truoc hien nha',
          author: 'Datmaniac',
          url: 'https://www.youtube.com/watch?v=jn8NhISy9rg'
        })

      })

      it('A blog can be created', function() {
        cy.contains('Mot ngay').contains('view').click()
        cy.contains('Mot ngay').get('#like-button').click()
        cy.contains('Mot ngay').get('.likes').contains('likes 1')
      })

      it('A blog can be delete by the user who create the blog', function() {
        cy.contains('Nang tho').contains('view').click()
        cy.contains('Nang tho').get('#delete-button').click()
        // cy.get('html').should('not.contain', 'Nang tho Hoang Dung')
      })

      it('A blog can be delete by the user who not create the blog', function() {
        cy.contains('logout').click()
        cy.login({username: 'nhinhu', password: 'pleupleu'})
        cy.contains('Nang tho').contains('view').click()
        cy.contains('Nang tho').should('not.contain', 'Remove')
      })

      it('Check the order of blogs', function() {
        cy.contains('Thien ha truoc hien nha').contains('view').click()
        cy.contains('Thien ha truoc hien nha').get('#like-button').click()
        cy.contains('Thien ha truoc hien nha').contains('hide').click()
        cy.get('.bloghide').then(buttons =>
          cy.contains('Thien ha truoc hien nha')
        )
      })
    })
  })
})