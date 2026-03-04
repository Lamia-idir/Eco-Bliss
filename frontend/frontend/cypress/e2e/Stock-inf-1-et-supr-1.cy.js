
describe(" le panier", () => {

    beforeEach(() => {
  cy.loginUI()
})

it("Stock < 1 : bouton Ajouter désactivé", () => {

  cy.api("GET", "/products").then((res) => {

    const product = res.body.find(p => Number(p.availableStock) < 1)
    expect(product).to.exist

    cy.visit(`/#/products/${product.id}`)

    cy.get('[data-cy="detail-product-add"]')
    .scrollIntoView()
      .should("be.visible")
      .and("be.disabled")

  })
})

it("Stock > 0 : bouton Ajouter activé", () => {

  cy.api("GET", "/products").then((res) => {

    const product = res.body.find(p => Number(p.availableStock) > 0)
    expect(product).to.exist

    cy.visit(`/#/products/${product.id}`)

    cy.get('[data-cy="detail-product-add"]')
    .scrollIntoView()
      .should("be.visible")
      .and("not.be.disabled")

  })
})
})