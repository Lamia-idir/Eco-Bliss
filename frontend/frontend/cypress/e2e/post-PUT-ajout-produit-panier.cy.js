
describe("Ajouter un produit au panier", () => {

  const body = { product: 4, quantity: 10 }

  it("POST /orders/add renvoie 401 si non connecté", () => {
    cy.api("POST", "/orders/add", { body }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })

  it("POST /orders/add renvoie 200/201 si connecté", () => {
    cy.loginApi().then((token) => {
      cy.api("POST", "/orders/add", {
        headers: { Authorization: `Bearer ${token}` },
        body
      }).then((res) => {
        expect([200, 201]).to.include(res.status)
      })
    })
  })

  it("PUT /orders/add renvoie 401 si non connecté", () => {
    cy.api("PUT", "/orders/add", { body }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })

  it("PUT /orders/add renvoie 200/201 si connecté", () => {
    cy.loginApi().then((token) => {
      cy.api("PUT", "/orders/add", {
        headers: { Authorization: `Bearer ${token}` },
        body
      }).then((res) => {
        expect([200, 201]).to.include(res.status)
      })
    })
  })

})