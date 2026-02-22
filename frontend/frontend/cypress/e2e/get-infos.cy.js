describe("Sécurité - Route /me", () => {

  it("GET /me renvoie 401 si non connecté", () => {

    cy.request({
      method: "GET",
      url: "http://localhost:8081/me",
      failOnStatusCode: false
    }).then((res) => {

      expect([401, 403]).to.include(res.status)


    })

  })

})
