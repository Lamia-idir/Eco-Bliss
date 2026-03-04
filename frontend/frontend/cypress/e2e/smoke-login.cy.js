describe('Smoke Test - Connexion', () => {

 it(' Présence des champs et boutons de connexion', () => {

cy.visit('/')

  cy.get('[data-cy="nav-link-login"]')
    .should('be.visible')
    .and('contain', 'Connexion')
    .click()

  //  Attendre que la page login soit chargée
  cy.get('[data-cy="login-input-username"]', { timeout: 10000 })
    .should('be.visible')

  //  Vérifier label Email
  cy.contains('label', 'Email')
    .should('be.visible')

  //  Vérifier champ Email
  cy.get('[data-cy="login-input-username"]')
    .should('be.visible')

  //  Vérifier label Mot de passe
  cy.contains('label', 'Mot de passe')
    .should('be.visible')

  //  Vérifier champ Mot de passe
  cy.get('[data-cy="login-input-password"]')
    .should('be.visible')

  //  Vérifier bouton Connexion
  cy.get('[data-cy="login-submit"]')
    .should('be.visible')

})


})
