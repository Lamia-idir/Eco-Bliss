describe("Orders-Sécurité-accès", () => {
it("GET/récupérer-le-panier-si-non-connecté", () => {
cy.request({
method: "GET",
url: "http://localhost:8081/orders",
failOnStatusCode: false
}).then((res) => {
expect(res.status).to.eq(401)
})
})

it("GET/récupérer-le-panier-si-connecté", () => {
cy.fixture("user").then((user) => {
cy.request({
method: "POST",
url: "http://localhost:8081/login",
body: {
username: user.username,
password: user.password
}
}).then((loginRes) => {

const token = loginRes.body.token
expect(token).to.exist

cy.request({
method: "GET",
url: "http://localhost:8081/orders",
headers: {
Authorization: `Bearer ${token}`
}
}).then((ordersRes) => {
expect(ordersRes.status).to.eq(200)
})

})
})
})
})
