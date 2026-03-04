/// <reference types="cypress" />


//pour se connecter à un compte utilisateur avant chaque test
Cypress.Commands.add("loginUI", () => {
cy.visit('/')
  cy.get('[data-cy="nav-link-login"]').click()

  cy.fixture("user").then((user) => {
    cy.get('[data-cy="login-input-username"]').type(user.username)
    cy.get('[data-cy="login-input-password"]').type(user.password)
    cy.get('[data-cy="login-submit"]').click()
  })

  cy.get('[data-cy="nav-link-cart"]', { timeout: 10000 })
    .should("be.visible")
})

// Appelé API avec différents méthodes et chemins
Cypress.Commands.add("api", (method, path, options = {}) => {
  return cy.request({
    method,
    url: `${Cypress.env("apiUrl")}${path}`,
    failOnStatusCode: false,
    ...options
  })
})


//  Login API : récupère le token (utile pour tous les tests API)
Cypress.Commands.add("loginApi", () => {
  return cy.fixture("user").then((user) => {
    return cy.api("POST", "/login", {
      body: { username: user.username, password: user.password },
    }).then((res) => {
      expect(res.status).to.eq(200);
      return res.body.token;
    });
  });
});


//Récupérer la valeur du stock à partir de la page produit
Cypress.Commands.add("getStockValue", () => {
  return cy.get('[data-cy="detail-product-stock"]')
    .scrollIntoView()
    .should("be.visible")
    .invoke("text")
    .should("match", /-?\d+\s.*stock/i)
    .then((text) => {
      const stock = Number(text.match(/-?\d+/)[0])
      expect(stock).to.be.a("number")
      return stock
    })
})
