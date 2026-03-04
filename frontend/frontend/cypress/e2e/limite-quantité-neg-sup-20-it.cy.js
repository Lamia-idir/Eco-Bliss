describe("vérification quantité", () => {

    beforeEach(() => {
  cy.loginUI()
})

function testerQuantite(qty) {

  cy.get('[data-cy="nav-link-products"]').click()
  cy.location("hash").should("eq", "#/products")

  cy.get('[data-cy="product-link"]').first().click()

  cy.intercept("PUT", "**/orders/add").as("addToCart")

  cy.get('[data-cy="detail-product-quantity"]')
    .should("be.visible")
    .clear()
    .type(qty)

  cy.get('[data-cy="detail-product-add"]').click()
  .should("be.visible")

  cy.get("@addToCart.all").should("have.length", 0)
}

it("Limite - refuse une quantité négative", () => {

  cy.location("hash").should("eq", "#/")
  testerQuantite("-1")

})

it("Limite - refuse une quantité > 20", () => {

  cy.location("hash").should("eq", "#/")
  testerQuantite("25")

})

 it("Vérifie la présence du champ de disponibilité", () => {
   cy.get('[data-cy="nav-link-products"]').click()
 cy.location("hash").should("eq", "#/products")
 cy.get('[data-cy="product-link"]').first().click()

    // Vérifier que le champ stock est visible

      cy.get('[data-cy="detail-product-stock"]')
      .scrollIntoView()
  .should("be.visible")
  .invoke("text")
  .should("match", /\d+\s.*stock/i)

  })

})
