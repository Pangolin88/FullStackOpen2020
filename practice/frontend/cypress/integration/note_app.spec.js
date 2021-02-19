describe('Note app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Huynh Vi Ha',
      username: 'pangolin',
      password: 'meowmeow'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('login form can be opened', function() {
    cy.contains('log in').click()
    cy.get('#username').type('pangolin')
    cy.get('#password').type('meowmeow')
    cy.get('#login-button').click()

    cy.contains('Huynh Vi Ha logged in')
  })

  it('login fails with wrong password', function() {
    cy.contains('log in').click()
    cy.get('#username').type('mluukkai')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()
    cy.get('.error')
      .should('contain', 'Wrong credentials')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid')
    cy.get('html').should('not.contain', 'Matti Luukkainen logged in')
  })

  it('front page can be opened', function() {
    cy.contains('Notes')
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2020')
  })


  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'pangolin', password: 'meowmeow' })
    })

    it('a new note can be created', function() {
      cy.contains('create new note').click()
      cy.get('#note-content').type('a note created by cypress')
      cy.contains('save').click()
      cy.contains('a note created by cypress')
    })

    describe('and a note exists', function () {
      beforeEach(function () {
        cy.createNote({
          content: 'another note cypress',
          important: false
        })
      })

      it('it can be made important', function () {
        cy.contains('another note cypress')
          .contains('make important')
          .click()

        cy.contains('another note cypress')
          .contains('make not important')
      })
    })
  })
})