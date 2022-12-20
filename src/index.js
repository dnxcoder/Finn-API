const express = require("express");
const { v4: uuidv4 } = require("uuid");
const app = express();

app.use(express.json());

const costumers = [];

/*
cpf - string
name - string
id - uuid
*/

//Middleware
function verifyIfExistsAccountCPF(request, response, next) {
  const { cpf } = request.headers;

  const customer = costumers.find((customer) => customer.cpf === cpf);

  if (!customer) {
    return response.status(400).json({ error: "Customer not found" });
  }

  //Here we are adding to the request a propertie called customer
  //this way every request that is using this middlaware will already have the costumer
  request.customer = customer;

  return next();
}

app.post("/account", (request, response) => {
  const { cpf, name } = request.body;

  const customerAlreadyExists = costumers.some(
    (costumer) => costumer.cpf === cpf
  );

  if (customerAlreadyExists) {
    return response.status(400).json({ error: "Costumer already Exists!" });
  }

  costumers.push({
    id: uuidv4(),
    cpf,
    name,
    statement: [],
  });

  return response.status(201).send();
});

app.get("/statement", verifyIfExistsAccountCPF, (request, response) => {
  const { costumer } = request.statement;

  return response.json(request.customer.statement);
});

app.listen(3333);
