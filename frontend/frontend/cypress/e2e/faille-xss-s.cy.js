describe("Faille XSS", () => {
  beforeEach(() => {
    cy.loginUI(); // ✅ login sur l'UI (tu l’as déjà)
  });

  it("API - /orders/add refuse XSS + panier inchangé", () => {
    cy.loginApi().then((token) => {
      const headers = { Authorization: `Bearer ${token}` };

      //  Panier AVANT
      cy.api("GET", "/orders", { headers }).then((beforeRes) => {
        const beforeCount = (beforeRes.body.orderLines || []).length;

        //  XSS dans quantity
        cy.api("PUT", "/orders/add", {
          headers,
          body: { product: 1, quantity: "<script>alert('XSS')</script>" },
        }).then((res1) => {
          expect([400, 409, 422]).to.include(res1.status);

          //  Panier APRÈS 1
          cy.api("GET", "/orders", { headers }).then((after1Res) => {
            const after1Count = (after1Res.body.orderLines || []).length;
            expect(after1Count).to.eq(beforeCount);

            //  XSS dans product
            cy.api("PUT", "/orders/add", {
              headers,
              body: { product: "<img src=x onerror=alert('XSS')>", quantity: 1 },
            }).then((res2) => {
              expect([400, 409, 422]).to.include(res2.status);

              //  Panier APRÈS 2
              cy.api("GET", "/orders", { headers }).then((after2Res) => {
                const after2Count = (after2Res.body.orderLines || []).length;
                expect(after2Count).to.eq(beforeCount);
              });
            });
          });
        });
      });
    });
  });

  it("Absence de faille XSS dans les commentaires", () => {
    const xssPayload = "<script>alert('XSS')</script>";

    cy.window().then((win) => cy.stub(win, "alert").as("alertStub"));

    cy.get('[data-cy="nav-link-reviews"]').click();
    cy.url().should("include", "/#/reviews");

    cy.get('[data-cy="review-input-rating-images"]').children().eq(3).click();
    cy.get('[data-cy="review-input-title"]').type(xssPayload);
    cy.get('[data-cy="review-input-comment"]').type(xssPayload);
    cy.get('[data-cy="review-submit"]').click();

    cy.get("@alertStub").should("not.have.been.called");
    cy.contains(xssPayload).should("exist");
  });
});