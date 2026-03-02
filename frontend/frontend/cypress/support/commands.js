/// <reference types="cypress" />

Cypress.Commands.add("loginUI", () => {
  cy.visit("http://localhost:4200")
  cy.get('[data-cy="nav-link-login"]').click()

  cy.fixture("user").then((user) => {
    cy.get('[data-cy="login-input-username"]').type(user.username)
    cy.get('[data-cy="login-input-password"]').type(user.password)
    cy.get('[data-cy="login-submit"]').click()
  })

  cy.get('[data-cy="nav-link-cart"]', { timeout: 10000 })
    .should("be.visible")
})



