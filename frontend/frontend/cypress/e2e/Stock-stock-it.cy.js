describe("Tester le panier", () => {

    beforeEach(() => {
  cy.loginUI()
})

it("Stock < 1 : bouton Ajouter désactivé", () => {

  cy.request("GET", "http://localhost:8081/products").then((res) => {

    const product = res.body.find(p => Number(p.availableStock) < 1)
    expect(product).to.exist

    cy.visit(`http://localhost:8080/#/products/${product.id}`)

    cy.get('[data-cy="detail-product-add"]')
      .should('be.visible')
      .and('be.disabled')

  })
})

it("Stock > 0 : bouton Ajouter activé", () => {

  cy.request("GET", "http://localhost:8081/products").then((res) => {
     expect(res.status).to.eq(200)

    const product = res.body.find(p => Number(p.availableStock) > 0)
    expect(product).to.exist

    cy.visit(`http://localhost:8080/#/products/${product.id}`)

    cy.get('[data-cy="detail-product-add"]')
      .should('be.visible')
      .and('not.be.disabled')

  })
})

it("Vérifier l'ajout de produit au panier", () => {

  cy.request("GET", "http://localhost:8081/products").then((res) => {

    expect(res.status).to.eq(200)

    // Même variable que les autres tests
    const product = res.body.find(p => Number(p.availableStock) > 0)
    expect(product).to.exist

    const stockAvant = Number(product.availableStock)

    //  Aller sur la page produit ---
    cy.intercept("GET", `**/products/${product.id}`).as("getProduct")
    cy.visit(`http://localhost:8080/#/products/${product.id}`)
    cy.wait("@getProduct")

    //  Vérifier bouton actif ---
    cy.get('[data-cy="detail-product-add"]')
      .should('be.visible')
      .and('not.be.disabled')

    //  Ajouter au panier ---
    cy.intercept("PUT", "**/orders/add").as("addToCart")

    cy.get('[data-cy="detail-product-add"]').click()

    cy.wait("@addToCart")
      .its("response.statusCode")
      .should("be.oneOf", [200, 201, 204])

    //  Vérifier panier ---
    cy.get('[data-cy="nav-link-cart"]').click()
    cy.location("hash").should("eq", "#/cart")

    cy.get('[data-cy="cart-line-quantity"]')
      .first()
      .should('exist')
      .and('be.visible')
    //  Vérifier stock décrémenté ---
    cy.request("GET", `http://localhost:8081/products/${product.id}`)
      .then((res2) => {

        const stockApres = Number(res2.body.availableStock)
        expect(stockApres).to.eq(stockAvant - 1)

      })

  })

})




// it("Vérifier l'ajout de produit au panier", () => {

//   cy.getProductWithStock(1).then(({ productId, stockAvant }) => {

    // --- 2) Aller sur la page produit ---
    // cy.intercept("GET", `**/products/${productId}`).as("getProduct")
    // cy.visit(`http://localhost:8080/#/products/${productId}`)
    // cy.wait("@getProduct")

    // --- 3) Cliquer sur ajouter ---
    // cy.intercept("PUT", "**/orders/add").as("addToCart")

    // cy.get('[data-cy="detail-product-add"]')
    //   .should("be.visible")
    //   .and("not.be.disabled")
    //   .click()

    // cy.wait("@addToCart", { timeout: 20000 })
    //   .its("response.statusCode")
    //   .should("be.oneOf", [200, 201, 204])

    // --- 4) Vérifier panier ---
    // cy.get('[data-cy="nav-link-cart"]').click()
    // cy.location("hash").should("eq", "#/cart")

    // cy.get('[data-cy="cart-line-quantity"]')
    //   .first()
    //   .should('exist')
    //   .and('be.visible')
    //   .and('have.value', '1')

    // cy.go('back')

    // --- 5) Vérifier stock décrémenté ---
//     cy.request("GET", `http://localhost:8081/products/${productId}`)
//       .then((res2) => {
//         const stockApres = Number(res2.body.availableStock)
//         expect(stockApres).to.eq(stockAvant - 1)
//       })

//   })

// })

it("Limite - refuse une quantité négative", () => {
  cy.url().should("eq", "http://localhost:8080/#/")

cy.get('[data-cy="nav-link-cart"]').click()
cy.location("hash").should("eq", "#/cart")
cy.get("body").then(($body) => {
  const before = $body.find('[data-cy="cart-line-quantity"]').length
  cy.wait(4000)

cy.get('[data-cy="nav-link-products"]')
.click()
 cy.location("hash").should("eq", "#/products")
 cy.get('[data-cy="product-link"]').first().click()

  // Intercept avant de cliquer
  cy.intercept("PUT", "**/orders/add").as("addToCart")
 cy.get('[data-cy="detail-product-quantity"]')
 .should("be.visible")
 .clear()
 .type("-1")
 cy.get('[data-cy="detail-product-add"]')
   .click()

 cy.get('[data-cy="nav-link-cart"]').click()
  cy.location("hash").should("eq", "#/cart")

    cy.get("body").then(($body2) => {
    const after = $body2.find('[data-cy="cart-line-quantity"]').length
    expect(after).to.eq(before)
  })
})

  //  Assertion métier : l'appel ne doit pas partir
  cy.wait(1000)
  cy.get("@addToCart.all").should("have.length", 0)
 
  })



it("entrez un chiffre supérieur à 20.", () => {
  
   cy.url().should("eq", "http://localhost:8080/#/")

cy.get('[data-cy="nav-link-cart"]').click()
cy.location("hash").should("eq", "#/cart")
cy.get("body").then(($body) => {
  const before = $body.find('[data-cy="cart-line-quantity"]').length
  cy.wait(5000)

cy.get('[data-cy="nav-link-products"]')
.click()
 cy.location("hash").should("eq", "#/products")
 cy.get('[data-cy="product-link"]').first().click()

  // Intercept avant de cliquer
  cy.intercept("PUT", "**/orders/add").as("addToCart")
 cy.get('[data-cy="detail-product-quantity"]')
 .should("be.visible")
 .clear()
 .type("25")
 cy.get('[data-cy="detail-product-add"]')
   .click()

 cy.get('[data-cy="nav-link-cart"]').click()
  cy.location("hash").should("eq", "#/cart")

    cy.get("body").then(($body2) => {
    const after = $body2.find('[data-cy="cart-line-quantity"]').length
    expect(after).to.eq(before)
  })
})
  //  Assertion métier : l'appel ne doit pas partir
  cy.wait(1000)
  cy.get("@addToCart.all").should("have.length", 0)
  
})


 it("Vérifie la présence du champ de disponibilité", () => {
   cy.get('[data-cy="nav-link-products"]').click()
 cy.location("hash").should("eq", "#/products")
 cy.get('[data-cy="product-link"]').first().click()

    // Vérifier que le champ stock est visible

      cy.get('[data-cy="detail-product-stock"]')
  .should("be.visible")
  .invoke("text")
  .should("match", /\d+\s.*stock/i)

  })


  it("UI Ajout au panier", () => {
  cy.get('[data-cy="nav-link-products"]').click()
  cy.location("hash").should("eq", "#/products")
  cy.get('[data-cy="product-link"]').first().click()

  // 1) Stock AVANT -> alias
  cy.get('[data-cy="detail-product-stock"]')
    .should("be.visible")
    .invoke("text")
    .should("match", /-?\d+\s.*stock/i) // accepte négatif
    .then((text) => {
      const stockBefore = Number(text.match(/-?\d+/)[0])
      expect(stockBefore).to.be.a("number")
      cy.wrap(stockBefore).as("stockBefore")
    })

  // 2) Ajouter au panier
  // (mieux) intercepter l'appel add
  cy.intercept("PUT", "**/orders/add").as("addToCart")
  cy.get('[data-cy="detail-product-add"]').click()
  cy.wait("@addToCart")

  // 3) Vérif panier
  cy.get("h1").should("contain", "Commande")
  cy.get('[data-cy="cart-line-quantity"]').should("be.visible")

  // 4) Retour produit
  cy.go("back")

  // 5) Stock APRÈS + comparaison avec stockBefore
  cy.get("@stockBefore").then((stockBefore) => {
    cy.get('[data-cy="detail-product-stock"]')
      .should("be.visible")
      .invoke("text")
      .should("match", /-?\d+\s.*stock/i)
      .then((text) => {
        const stockAfter = Number(text.match(/-?\d+/)[0])
        expect(stockAfter).to.be.a("number")
        expect(stockAfter).to.equal(stockBefore - 1)
      })
  })
})

})
