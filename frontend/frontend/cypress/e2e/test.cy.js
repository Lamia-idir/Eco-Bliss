describe('Page d\'accueil', () => {
  it('Visite le site', () => {
    cy.visit('http://localhost:8080/')
    cy.contains("Connexion", { timeout: 10000 }).should("be.visible")
    cy.get('[data-cy="nav-link-login"]').should('be.visible');
cy.get('[data-cy="nav-link-logout"]').should('not.exist');
  });

  it('se connecter au compte', () => {
     cy.visit('http://localhost:8080/')
     cy.get('[data-cy="nav-link-login"]').click();
 cy.url().should('include', '/login');
 cy.get('[data-cy="login-input-username"]').type('test2@test.fr')
 cy.get('[data-cy="login-input-password"]').type('testtest')
 cy.get('[data-cy="login-submit"]').click()
 cy.url().should('include', '#/')
 cy.get('[data-cy="nav-link-logout"]').should('be.visible');
 cy.get('[data-cy="nav-link-login"]').should('not.exist');

   })

})
