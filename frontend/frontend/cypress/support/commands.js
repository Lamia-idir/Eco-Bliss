/// <reference types="cypress" />

Cypress.Commands.add("loginUI", () => {
  cy.visit("http://localhost:8080")
  cy.get('[data-cy="nav-link-login"]').click()

  cy.fixture("user").then((user) => {
    cy.get('[data-cy="login-input-username"]').type(user.username)
    cy.get('[data-cy="login-input-password"]').type(user.password)
    cy.get('[data-cy="login-submit"]').click()
  })

  cy.get('[data-cy="nav-link-cart"]', { timeout: 10000 })
    .should("be.visible")
})



Cypress.Commands.add("getProductWithStock", (minStock = 1) => {
  return cy.request("GET", "http://localhost:8081/products").then((res) => {

    expect(res.status).to.eq(200)

    const goodProduct = res.body.find(
      (p) => Number(p.availableStock) > minStock
    )

    expect(goodProduct, `Produit avec stock > ${minStock}`).to.exist

    return {
      productId: goodProduct.id,
      stockAvant: Number(goodProduct.availableStock),
      productName: goodProduct.name
    }
  })
})


