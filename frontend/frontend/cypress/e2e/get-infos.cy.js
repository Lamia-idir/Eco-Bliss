
  it("GET /me renvoie 401/403 si non connecté", () => {
    cy.api("GET", "/me").then((res) => {
      expect([401, 403]).to.include(res.status)
    })
  })
