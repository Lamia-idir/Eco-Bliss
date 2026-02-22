it("Ajoute au panier un produit avec stock > 1 (choix via API + clic UI)", () => {
  cy.visit("http://localhost:8080")

  // Login UI
  cy.get('[data-cy="nav-link-login"]').click()
  cy.fixture("user").then((user) => {
    cy.get('[data-cy="login-input-username"]').type(user.username)
    cy.get('[data-cy="login-input-password"]').type(user.password)
    cy.get('[data-cy="login-submit"]').click()
  })
  cy.get('[data-cy="nav-link-cart"]', { timeout: 10000 }).should("be.visible")

  // Aller à la liste produits
  cy.contains("button", "Voir les produits").click()
  cy.contains("h1", "Nos produits").should("be.visible")

  // ✅ Intercepter l'appel d'ajout panier pour voir s'il part et s'il réussit
  cy.intercept("PUT", "**/orders/add**").as("addToCart")

  // ✅ Choisir un produit via API (stock > 1)
  cy.request("GET", "http://localhost:8081/products").then((res) => {
    const products = res.body

    // ⚠️ adapte ici si ton champ n'est pas availableStock
    const good = products.find((p) => Number(p.availableStock) > 1)
    expect(good, "produit stock>1").to.exist

    const id = String(good.id)

    // ✅ Cliquer le bon produit DANS la liste (pas via visit direct)
    cy.get('[data-cy="product-link"]')
      .filter((i, el) => (el.getAttribute("href") || "").includes(id))
      .first()
      .click()

    // Ajouter au panier
    cy.get('[data-cy="detail-product-add"]')
      .should("be.visible")
      .and("not.be.disabled")
      .click()

    // ✅ Vérifier que l'API a bien répondu OK
    cy.wait("@addToCart").its("response.statusCode").should("be.oneOf", [200, 201, 204])

    // ✅ Aller au panier et vérifier qu'il y a au moins un item
    cy.get('[data-cy="nav-link-cart"]').click()
    cy.get('[data-cy="cart-item"]').should("have.length.greaterThan", 0)
  })
})
