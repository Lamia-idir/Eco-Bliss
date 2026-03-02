describe('Smoke - Boutons Ajouter au panier', () => {

  it('Vérifie la présence des boutons Ajouter au panier quand connecté', () => {

    cy.visit('http://localhost:4200')

  
    // 🔹 Vérifier présence boutons Ajouter au panier
  cy.get('[data-cy="nav-link-products"]')
      .should('exist')
      .and('be.visible')
      .click()
      cy.contains('h1', 'Nos produits')
      .should('exist')
      .and('be.visible')

    cy.get('[data-cy="product-link"]')
      .first()
      .click()

cy.get('[data-cy="detail-product-add"]')
  .should('be.visible')
  .and('contain', 'Ajouter au panier')


  })

})
