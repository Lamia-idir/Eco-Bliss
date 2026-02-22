const goToCartAndCountLines = () => {
  cy.get('[data-cy="nav-link-cart"]').click()
  cy.location("hash").should("eq", "#/cart")

  return cy.get("body").then(($body) => {
    return $body.find('[data-cy="cart-line-quantity"]').length
  })
}

const goToFirstProduct = () => {
  cy.get('[data-cy="nav-link-products"]').click()
  cy.location("hash").should("eq", "#/products")
  cy.get('[data-cy="product-link"]').first().click()
}

const setQuantityAndTryAdd = (qty) => {
  cy.intercept("PUT", "**/orders/add").as("addToCart")

  cy.get('[data-cy="detail-product-quantity"]')
    .should("be.visible")
    .clear()
    .type(String(qty))
    .blur()

  cy.get('[data-cy="detail-product-add"]').click({ force: true })
}

it("Quantité -1 : ne s'ajoute pas", () => {
  cy.visit("http://localhost:8080/#/")
  cy.location("hash").should("eq", "#/")

  goToCartAndCountLines().then((before) => {

    goToFirstProduct()
    setQuantityAndTryAdd(-1)

    goToCartAndCountLines().then((after) => {
      expect(after).to.eq(before)
    })

    cy.wait(500)
    cy.get("@addToCart.all").should("have.length", 0)
  })
})