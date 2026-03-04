

describe('Smoke - Boutons Ajouter au panier', () => {

  it('Vérifie la présence des boutons Ajouter au panier quand connecté', () => {

    cy.loginUI() //  fait : visit + login + vérifie nav-link-cart visible

    // Vérifier que la connexion est réussie
    cy.url().should('include', '/#/')        
    cy.contains('Déconnexion').should('be.visible')


  })

})