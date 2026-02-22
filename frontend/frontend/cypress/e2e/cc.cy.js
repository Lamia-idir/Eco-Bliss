describe("Orders - Ajouter produit", () => {
  it("PUT /orders/add renvoie 200/204 si connecté", () => {
    cy.fixture("user").then((user) => {
      cy.request({
        method: "POST",
        url: "http://localhost:8081/login",
        body: { username: user.username, password: user.password }
      }).then((loginRes) => {
        const token = loginRes.body.token
        expect(token).to.exist

        cy.request({
          method: "PUT",
          url: "http://localhost:8081/orders/add",
          headers: { Authorization: `Bearer ${token}` },
          body: { product: 4, quantity: 10 },
          failOnStatusCode: false
        }).then((addRes) => {
          expect([200, 204]).to.include(addRes.status)
        })
      })
    })
  })
})
