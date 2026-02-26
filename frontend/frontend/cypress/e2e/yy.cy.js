describe("Faille XSS", () => {
    beforeEach(() => {
  cy.loginUI()
})

it("API - /orders/add refuse payload XSS (product/quantity)", () => {
  cy.fixture("user").then((user) => {
    cy.request("POST", "http://localhost:8081/login", {
      username: user.username,
      password: user.password,
    }).then((loginRes) => {
      const token = loginRes.body.token

      //  Injection dans quantity
      cy.request({
        method: "PUT",
        url: "http://localhost:8081/orders/add",
        headers: { Authorization: `Bearer ${token}` },
        body: {
          product: 1,
          quantity: "<script>alert('XSS')</script>",
        },
        failOnStatusCode: false, // IMPORTANT: on attend une erreur
      }).then((res) => {
        expect([400, 409, 422]).to.include(res.status)
      })

      //  Injection dans product
      cy.request({
        method: "PUT",
        url: "http://localhost:8081/orders/add",
        headers: { Authorization: `Bearer ${token}` },
        body: {
          product: "<img src=x onerror=alert('XSS')>",
          quantity: 1,
        },
        failOnStatusCode: false,
      }).then((res) => {
        expect([400, 409, 422]).to.include(res.status)
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

   cy.url().should("eq", "http://localhost:8080/#/reviews")

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