describe("Tests API - retourner-produits", () => {

  it("GET /products retourne une liste de produits", () => {

    cy.request("GET", "http://localhost:8081/products")
      .then((res) => {

        expect(res.status).to.eq(200)
        expect(res.body).to.be.an("array")
        expect(res.body.length).to.be.greaterThan(0)
        const product = res.body[0]

        expect(product).to.have.property("id")
        expect(product).to.have.property("name")
        expect(product).to.have.property("price")
        expect(product).to.have.property("description")
        expect(product).to.have.property("picture")

      })

  })


  it("GET /products/{id} renvoie 200 si le produit existe", () => {

    cy.request("GET", "http://localhost:8081/products/3")
      .then((res) => {

        expect(res.status).to.eq(200)
        expect(res.body).to.have.property("id", 3)
        expect(res.body).to.have.property("name")
        expect(res.body).to.have.property("price")

      })

})

it("GET /products/{id} renvoie 404 si le produit n'existe pas", () => {

  cy.request({
    method: "GET",
    url: "http://localhost:8081/products/9999",
    failOnStatusCode: false
  }).then((res) => {
    expect(res.status).to.eq(404)

  })

})

})
