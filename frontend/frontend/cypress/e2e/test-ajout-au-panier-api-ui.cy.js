

describe("Tester l'ajout au panier (UI + vérification API)", () => {

  beforeEach(() => {
    cy.loginUI()
  })

  it(" Ajouter au panier + vérifier via API", () => {
    cy.loginApi().then((token) => {

      cy.get('[data-cy="nav-link-products"]').click()
      cy.get('[data-cy="product-link"]').first().click()

      cy.intercept("PUT", "**/orders/add").as("addToCart")

      cy.get('[data-cy="detail-product-name"]')
        .should("be.visible")
        .and("not.be.empty")

      cy.get('[data-cy="detail-product-add"]')
        .should("be.visible")
        .and("not.be.disabled")
        .click()

      cy.wait("@addToCart")

      // Vérif panier via API (sans URL en dur)
      cy.api("GET", "/orders", {
        headers: { Authorization: `Bearer ${token}` }
      }).then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.orderLines.length).to.be.greaterThan(0)
      })

    })
  })


  it("UI - Ajout au panier décrémente le stock", () => {
  cy.get('[data-cy="nav-link-products"]').click()
  cy.location("hash").should("eq", "#/products")
  cy.get('[data-cy="product-link"]').first().click()

  cy.get('[data-cy="detail-product-add"]').should("be.visible").and("exist")

  cy.getStockValue().then((stockBefore) => {

    cy.intercept("PUT", "**/orders/add").as("addToCart")
    cy.get('[data-cy="detail-product-add"]').click()
    cy.wait("@addToCart")

    cy.get("h1").should("contain", "Commande")
    cy.get('[data-cy="cart-line"]').should("be.visible")

    cy.go("back")

    cy.getStockValue().then((stockAfter) => {
      expect(stockAfter).to.eq(stockBefore - 1)
    })
  })
})

})