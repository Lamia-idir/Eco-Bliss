
describe(" le panier", () => {

    beforeEach(() => {
  cy.loginUI()  // se connecter au compte utilisateur 
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

 it("PUT /orders/add refuse un produit avec stock < 0 ", () => {
    cy.loginApi().then((token) => {

      //  Trouver un produit avec stock négatif via l'API
      cy.api("GET", "/products").then((prodRes) => {
        expect(prodRes.status).to.eq(200)

        const product = prodRes.body.find(p => Number(p.availableStock) < 0)
        expect(product, "Produit avec stock < 0").to.exist

          //  Tenter l'ajout au panier (on autorise l'erreur)
          cy.api("PUT", "/orders/add", {
            headers: { Authorization: `Bearer ${token}` },
            failOnStatusCode: false,
            body: { product: product.id, quantity: 1 }
          }).then((addRes) => {
            expect([400, 409]).to.include(addRes.status)

        })
      })
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