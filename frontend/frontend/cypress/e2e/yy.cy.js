
    beforeEach(() => {
  cy.loginUI()
})

it("Ajouter au panier + vérifier via API", () => {

  // 1️⃣ Se connecter via API
  cy.fixture("user").then((user) => {
    cy.request("POST", "http://localhost:8081/login", {
      username: user.username,
      password: user.password,
    }).then((loginRes) => {

      const token = loginRes.body.token

      // 3️⃣ Aller sur un produit
      cy.get('[data-cy="nav-link-products"]').click()
      cy.get('[data-cy="product-link"]').first().click()

      // 4️⃣ Cliquer sur Ajouter au panier

      cy.intercept("PUT", "**/orders/add*").as("addToCart")
      cy.get('[data-cy="detail-product-add"]').click()
      .should("be.visible")
      .and("not.be.disabled")
    
     cy.wait("@addToCart",)
      // 5️⃣ Vérifier via API que le panier contient au moins 1 produit
      cy.request({
        method: "GET",
        url: "http://localhost:8081/orders",
        headers: { Authorization: `Bearer ${token}` }
      }).then((res) => {

        expect(res.status).to.eq(200)

        // Vérifie que le panier n'est pas vide
        expect(res.body.orderLines.length).to.be.greaterThan(0)

      })

    })
  })
})