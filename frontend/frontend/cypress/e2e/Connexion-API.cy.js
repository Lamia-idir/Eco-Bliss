

describe("API - Login", () => {

  let user;

  before(() => {
    cy.fixture("user").then((u) => {
      user = u;
    });
  });

  it("Login OK", () => {

    cy.api("POST", "/login", {
      body: user
    }).then((response) => {

      expect(response.status).to.eq(200);

    });

  });

  it("Login KO - mauvais mot de passe", () => {

    const wrongUser = { ...user, password: "wrongPassword" };

    cy.api("POST", "/login", {
      body: wrongUser
    }).then((response) => {

      expect(response.status).to.eq(401);

    });

  });

});



