
describe("API - Login", () => {

  let user;

  before(() => {
    cy.fixture("user").then((u) => {
      user = u;
    });
  });

  it("Login OK", () => {
    cy.request("POST", `${Cypress.env("apiUrl")}/login`, user)
      .then((response) => {
        expect(response.status).to.eq(200);
      });
  });
it("Login KO - mauvais mot de passe", () => {
  const wrongUser = { ...user, password: "wrongPassword" };

  cy.request({
    method: "POST",
    url: `${Cypress.env("apiUrl")}/login`,
    body: wrongUser,
    failOnStatusCode: false, 
  }).then((response) => {
    expect(response.status).to.eq(401);
  });
});

});



