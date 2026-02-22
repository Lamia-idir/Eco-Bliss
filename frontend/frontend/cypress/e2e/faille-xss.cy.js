describe('Test sécurité XSS', () => {
  it('Vérifie l’absence de faille XSS dans les commentaires', () => {

    const xssPayload = '<script>alert("XSS")</script>'

    cy.visit('http://localhost:8080')

    // Login
    cy.get('[data-cy="nav-link-login"]').click()

    cy.fixture('user').then((user) => {
      cy.get('[data-cy="login-input-username"]').type(user.username)
      cy.get('[data-cy="login-input-password"]').type(user.password)
      cy.get('[data-cy="login-submit"]').click()
      cy.get('[data-cy="nav-link-cart"]').should('be.visible')
      
    })

    cy.get('[data-cy="nav-link-reviews"]')
  .should('exist')
  .and('be.visible')
  .and('contain', 'Avis')
  .click()
  
  cy.get('h1')
  .should('exist')
  .and('be.visible')
  .and('contain', 'Votre avis')


  cy.window().then((win) => {
      cy.stub(win, 'alert').as('alertStub')
     })

cy.get('[data-cy="review-input-rating-images"]')
  .children()
  .eq(3)   // index commence à 0 → 3 = 4ème élément
  .should('exist')
  .and('be.visible')
  .click()

cy.get('[data-cy="review-input-title"]').type('COUCOU')
cy.get('[data-cy="review-input-comment"]').type(xssPayload )
cy.get('[data-cy="review-submit"]')
  .should('exist')
  .and('be.visible')
  .click()





    // L’alerte ne doit jamais se déclencher
    cy.get('@alertStub').should('not.have.been.called')
    cy.get('body').should('not.contain', '<script>alert("XSS")</script>')


   
  })
})






