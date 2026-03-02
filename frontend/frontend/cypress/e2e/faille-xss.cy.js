
describe("Faille XSS", () => {
    beforeEach(() => {
  cy.loginUI()
})
it("API - /orders/add refuse payload XSS (product/quantity) + panier inchangé", () => {
  cy.fixture("user").then((user) => {
    cy.request("POST", "http://localhost:8081/login", {
      username: user.username,
      password: user.password,
    }).then((loginRes) => {
      expect(loginRes.status).to.eq(200)
      // expect(loginRes.body).to.have.property("token")

      const token = loginRes.body.token

      //  GET /orders AVANT (référence panier)
      cy.request({
        method: "GET",
        url: "http://localhost:8081/orders",
        headers: { Authorization: `Bearer ${token}` },
      }).then((beforeRes) => {
        expect(beforeRes.status).to.eq(200)

        const beforeCount = (beforeRes.body.orderLines || []).length

        //Injection dans quantity
        cy.request({
          method: "PUT",
          url: "http://localhost:8081/orders/add",
          headers: { Authorization: `Bearer ${token}` },
          body: {
            product: 1,
            quantity: "<script>alert('XSS')</script>",
          },
          failOnStatusCode: false,
        }).then((resQuantity) => {
          expect([400, 409, 422]).to.include(resQuantity.status)

          // GET /orders APRES 1er test -> panier inchangé
          cy.request({
            method: "GET",
            url: "http://localhost:8081/orders",
            headers: { Authorization: `Bearer ${token}` },
          }).then((afterQuantityRes) => {
            expect(afterQuantityRes.status).to.eq(200)

            const afterQuantityCount = (afterQuantityRes.body.orderLines || []).length
            expect(afterQuantityCount).to.eq(beforeCount)

           
            // 3) Injection dans product
           
            cy.request({
              method: "PUT",
              url: "http://localhost:8081/orders/add",
              headers: { Authorization: `Bearer ${token}` },
              body: {
                product: "<img src=x onerror=alert('XSS')>",
                quantity: 1,
              },
              failOnStatusCode: false,
            }).then((resProduct) => {
              expect([400, 409, 422]).to.include(resProduct.status)

              //  GET /orders APRES 2e test -> panier inchangé
              cy.request({
                method: "GET",
                url: "http://localhost:8081/orders",
                headers: { Authorization: `Bearer ${token}` },
              }).then((afterProductRes) => {
                expect(afterProductRes.status).to.eq(200)

                const afterProductCount = (afterProductRes.body.orderLines || []).length
                expect(afterProductCount).to.eq(beforeCount)
              })
            })
          })
        })
      })
    })
  })
})

it("Vérifier absence faille XSS dans les commentaires", () => {

  const xssPayload = "<script>alert('XSS')</script>"

  //  Bloquer window.alert pour détecter exécution
  cy.window().then((win) => {
    cy.stub(win, "alert").as("alertStub")
  })
  cy.get('[data-cy="nav-link-reviews"]')
  .should("exist")
  .and("be.visible")
  .and("contain.text", "Avis")
  .click()

   cy.url().should("eq", "http://localhost:4200/#/reviews")

  cy.get("h1")
    .should("exist")
    .and("be.visible")
    .and("contain.text", "Votre avis")
    cy.get('[data-cy="review-input-rating-images"]')
  .children()
  .eq(3)   
  .click()

  cy.get('[data-cy="review-input-title"]')
    .should("exist")
    .and("be.visible")
     .type(xssPayload)

  //  Vérifier champ commentaire
  cy.get('[data-cy="review-input-comment"]')
    .should("exist")
    .and("be.visible")
  .type(xssPayload)

  // Envoyer le commentaire
  
  cy.get('[data-cy="review-submit"]').click()


  //  Vérifier qu'aucune alerte ne s'est déclenchée
  cy.get("@alertStub").should("not.have.been.called")

  // 6️ Vérifier que le script est affiché comme TEXTE
  cy.contains(xssPayload).should("exist")

})
 })




