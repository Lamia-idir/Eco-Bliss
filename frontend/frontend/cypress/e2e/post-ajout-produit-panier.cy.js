describe(" Ajouter un produit au panier", () => {


  it("POST /Ajout produit au panier cas non connecté", () => {

    cy.request({
      method: "POST",
      url: "http://localhost:8081/orders/add",
      body: {
        product: 4,
        quantity: 10
      },
      failOnStatusCode: false
    }).then((res) => {

      expect(res.status).to.eq(401)

    })

  })

  it("POST /Ajout produit au panier cas connecté", () => {

    cy.fixture("user").then((user) => {

      cy.request({
        method: "POST",
        url: "http://localhost:8081/login",
        body: {
          username: user.username,
          password: user.password
        },
         failOnStatusCode: false
      }).then((loginRes) => {

        const token = loginRes.body.token

        cy.request({
          method: "POST",
          url: "http://localhost:8081/orders/add",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: {
            product: 4,
            quantity: 10
          },
           failOnStatusCode: false
          
        }).then((addRes) => {

          expect(addRes.status).to.be.oneOf([200, 201])

        })

      })

    })

  })






   it("PUT /Ajout produit au panier cas non connecté", () => {

    cy.request({
      method: "PUT",
      url: "http://localhost:8081/orders/add",
      body: {
        product: 4,
        quantity: 10
      },
      failOnStatusCode: false
    }).then((res) => {

      expect(res.status).to.eq(401)

    })

  })

  it("PUT /Ajout produit au panier cas connecté", () => {

    cy.fixture("user").then((user) => {

      cy.request({
        method: "POST",
        url: "http://localhost:8081/login",
        body: {
          username: user.username,
          password: user.password
        },
         failOnStatusCode: false
      }).then((loginRes) => {

        const token = loginRes.body.token

        cy.request({
          method: "PUT",
          url: "http://localhost:8081/orders/add",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: {
            product: 4,
            quantity: 10
          },
           failOnStatusCode: false
          
        }).then((addRes) => {

          expect(addRes.status).to.be.oneOf([200, 201])

        })

      })

    })

  })





})
