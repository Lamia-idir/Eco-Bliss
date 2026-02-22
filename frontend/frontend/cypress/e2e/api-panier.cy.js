describe("API - orders/add", () => {

  it("orders/add - avec token => doit fonctionner", () => {

    getToken().then((token) => {

      const payload = {
        orderLines: [
          {
            product: "/products/3",
            quantity: 1
          }
        ]
      };

      cy.request({
        method: "PUT",
        url: `${BASE_URL}/orders/add`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: payload,
        failOnStatusCode: false
      }).then((res) => {

        cy.log("STATUS: " + res.status);
        cy.log("BODY: " + JSON.stringify(res.body));

        expect(res.status).to.be.oneOf([200, 201]);

      });

    });

  });

});
