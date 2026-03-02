describe('Smoke - Boutons Ajouter au panier', () => {

  it('Vérifie la présence des boutons Ajouter au panier quand connecté', () => {

    cy.visit('http://localhost:4200')

    // 🔹 Aller sur la page login
    cy.get('[data-cy="nav-link-login"]')
      .should('be.visible')
      .click()

    // 🔹 Attendre chargement login
    cy.get('[data-cy="login-input-username"]', { timeout: 10000 })
      .should('be.visible')
        cy.get('[data-cy="login-input-password"]')
    .should('be.visible')

    cy.fixture('user').then((user) => {

  cy.get('[data-cy="login-input-username"]').type(user.username)
  cy.get('[data-cy="login-input-password"]').type(user.password)
  cy.get('[data-cy="login-submit"]').click()

})

    // 🔹 Vérifier que la connexion est réussie
    cy.get('[data-cy="nav-link-cart"]', { timeout: 10000 })
      .should('be.visible')
      cy.url().should('eq', 'http://localhost:8080/#/')
      cy.contains('Déconnexion').should('be.visible')




  })

})
