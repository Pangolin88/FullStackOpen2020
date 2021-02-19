describe('Note app', function() {
  beforeEach(function() {
    cy.visit('http://localhost:3000')
  })

  it('front page can be opened', function() {
    cy.contains('Notes')
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2020')
  })

  it('login form can be opened', function() {
    cy.contains('log in').click()
    cy.get('#username').type('pangolin')
    cy.get('#password').type('meowmeow')
    cy.get('#login-button').click()

    cy.contains('Huynh Vi Ha logged in')
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.contains('log in').click()
      cy.get('#username').type('pangolin')
      cy.get('#password').type('meowmeow')
      cy.get('#login-button').click()
    })

    it('a new note can be created', function() {
      cy.contains('create new note').click()
      cy.get('#note-content').type('a note created by cypress')
      cy.contains('save').click()
      cy.contains('a note created by cypress')
    })
  })
})