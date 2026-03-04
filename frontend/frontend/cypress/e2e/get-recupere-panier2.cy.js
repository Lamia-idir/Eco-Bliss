
describe("Orders - Sécurité accès", () => {

  it("GET /orders renvoie 401 si non connecté", () => {
    cy.api("GET", "/orders").then((res) => {
      expect(res.status).to.eq(401)
     
      expect(res.body).to.have.property("message")
      expect(res.body.message).to.include("JWT")
    })
  })

  it("GET /orders renvoie 200 si commande en cours, sinon 404 (aucune commande)", () => {
    cy.loginApi().then((token) => {
      cy.api("GET", "/orders", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {

        // Deux comportements possibles selon l'état du panier
        expect([200, 404]).to.include(res.status)

        if (res.status === 200) {
          //  commande en cours
          expect(res.body).to.have.property("orderLines")
          expect(res.body.orderLines).to.be.an("array")
        } else {
          //  aucune commande en cours
          expect(res.body).to.have.property("message")
          expect(res.body.message).to.include("Aucune commande")
        }
      })
    })
  })

})