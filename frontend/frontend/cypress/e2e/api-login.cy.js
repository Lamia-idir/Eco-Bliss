describe("API - Login", () => {

it("Login OK", () => {
  cy.fixture("user").then((user) => {
    cy.request({
      method: "POST",
      url: "http://localhost:8081/login",
      body: user,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200);

    });
  });
});


it("Login KO - mauvais mot de passe", () => {
  cy.fixture("user").then((user) => {

    const wrongUser = {
      ...user,
      password: "wrongPassword"
    };

    cy.request({
      method: "POST",
      url: "http://localhost:8081/login",
      body: wrongUser,
      failOnStatusCode: false
    }).then((response) => {
     expect([401]).to.include(response.status);

    });
  });
});

});




