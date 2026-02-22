describe("Nom du bloc de tests", () => {

    beforeEach(() => {
  cy.loginUI()
})



it("le stock doit être supérieur à 1 ", () => {

  cy.request("GET", "http://localhost:8081/products").then((res) => {
    expect(res.status).to.eq(200)

    const goodProduct = res.body.find((p) => Number(p.availableStock) > 1)
    expect(goodProduct, "Produit avec stock > 1").to.exist
    
})
})




it("Panier - ajout + vérif panier + vérif stock décrémenté", () => {

  cy.request("GET", "http://localhost:8081/products").then((res) => {
    expect(res.status).to.eq(200)

    const goodProduct = res.body.find((p) => Number(p.availableStock) > 1)
    expect(goodProduct, "Produit avec stock > 1").to.exist

    const productId = goodProduct.id
    const stockAvant = Number(goodProduct.availableStock)
   
    // --- 2) Aller sur la page produit ---
    cy.intercept("GET", `**/products/${productId}`).as("getProduct")
    cy.visit(`http://localhost:8080/#/products/${productId}`)
    cy.wait("@getProduct")

    // --- 3) Cliquer sur ajouter (attendre la réponse API) ---
    cy.intercept("PUT", "**/orders/add").as("addToCart")

    cy.get('[data-cy="detail-product-add"]')
      .should("be.visible")
      .and("not.be.disabled")
      .click()

    cy.wait("@addToCart", { timeout: 20000 })
      .its("response.statusCode")
      .should("be.oneOf", [200, 201, 204])





    // --- 4) Vérifier que le produit a été ajouté au panier (UI) ---
    cy.get('[data-cy="nav-link-cart"]').click()
    cy.location("hash").should("eq", "#/cart")

     cy.get('[data-cy="cart-line-quantity"]')
    .first()
    .should('exist')
    .and('be.visible')
    .and('have.value', '1')

    cy.go('back')

    // --- 6) Vérifier que le stock a diminué de qty (API = source de vérité) ---
    cy.request("GET", `http://localhost:8081/products/${productId}`).then((res2) => {
      const stockApres = Number(res2.body.availableStock)
      expect(stockApres).to.eq(stockAvant - 1)
    })
  })
})

});
