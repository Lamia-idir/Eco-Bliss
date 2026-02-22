describe("Orders - Ajout produit en rupture de stock", () => {
  it("PUT /orders/add refuse l'ajout si availableStock <= 0", function () {

    cy.fixture("user").then((user) => {
      //  Login
      cy.request({
        method: "POST",
        url: "http://localhost:8081/login",
        body: { username: user.username, password: user.password }
      }).then((loginRes) => {

        const token = loginRes.body.token
        expect(token).to.exist

        // 2) Chercher un produit en rupture (availableStock <= 0)
        cy.request({
          method: "GET",
          url: "http://localhost:8081/products"
        }).then((prodRes) => {

          expect(prodRes.status).to.eq(200)
          expect(prodRes.body).to.be.an("array")

          const outOfStock = prodRes.body.find(p => p.availableStock <= 0)

          // Si aucun produit n'est en rupture dans les données => on skip (sinon test impossible)
          if (!outOfStock) {
            this.skip()
          }

          //  Tentative d'ajout au panier
          cy.request({
            method: "PUT",
            url: "http://localhost:8081/orders/add",
            headers: { Authorization: `Bearer ${token}` },
            body: { product: outOfStock.id, quantity: 1 },
            failOnStatusCode: false
          }).then((addRes) => {

     //  Attendus (selon API : 400 / 409 / 422)
            expect([400, 409, 422]).to.include(addRes.status)

            // expect(addRes.status).to.eq(400)


            // Optionnel : si l'API renvoie un message, on vérifie qu'il parle de stock
            // if (addRes.body && (addRes.body.message || addRes.body.error)) {
            //   const msg = (addRes.body.message || addRes.body.error).toString().toLowerCase()
            //   expect(msg).to.match(/stock|rupture|indisponible/)
            // }
          })
        })
      })
    })
  })
})
