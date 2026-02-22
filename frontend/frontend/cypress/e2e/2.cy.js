describe('Smoke - Bouton Ajouter au panier', () => {

  beforeEach(() => {

    cy.visit('http://localhost:8080')

    // Aller sur la page login
    cy.get('[data-cy="nav-link-login"]')
      .should('be.visible')
      .click()

    // Attendre chargement login
    cy.get('[data-cy="login-input-username"]', { timeout: 10000 })
      .should('be.visible')

    // Se connecter via fixture
    cy.fixture('user').then((user) => {
      cy.get('[data-cy="login-input-username"]').type(user.username)
      cy.get('[data-cy="login-input-password"]').type(user.password)
      cy.get('[data-cy="login-submit"]').click()
    })

    // Vérifier que la connexion est réussie
    cy.get('[data-cy="nav-link-cart"]', { timeout: 10000 })
      .should('be.visible')

    // Aller à la page produits
    cy.contains('button', 'Voir les produits')
      .should('be.visible')
      .click()

    cy.contains('h1', 'Nos produits')
      .should('be.visible')

  })


  it('Vérifie que le stock est superieur à 1', () => {

    // Ouvrir le 1er produit
    cy.get('[data-cy="product-link"]').first().click()

    //  L'image est visible 
    cy.get('[data-cy="detail-product-img"]')
      .should('exist')
      .and('be.visible')

    cy.get('[data-cy="detail-product-name"]')
      .should('be.visible')
      .and('contain', 'Sentiments printaniers')

    // Vérifier le bouton "Ajouter au panier"
    cy.get('[data-cy="detail-product-stock"]')
      .should('be.visible')
      .invoke('text')
      .then((text) => {

        // Extraire le nombre du texte (ex: "21 en stock")
        const stock = parseInt(text.match(/-?\d+/)[0])
        // Vérifier que le stock est > 1
        expect(stock).to.be.greaterThan(1)

      })

  })


  it('Vérifier que le bouton Ajouter au panier fonctionne', () => {

    cy.get('[data-cy="product-link"]').first().click()

    cy.get('[data-cy="detail-product-add"]')
      .should('be.visible')
      .and('not.be.disabled')
      .click()

  })

})

