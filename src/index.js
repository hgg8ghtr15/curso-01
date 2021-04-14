let express = require('express')

let { v4: uuidv4 } = require('uuid')

//crio o App
let app = express()

//midware usado para receber um Json
app.use(express.json())

//simula o banco de dados
let customers = []

//Middleware
function vericicarCPF(request, response, next) {
  //pega CPF
  let {cpf} = request.headers

  //procura o cpf
  let customer = customers.find((customer) => customer.cpf === cpf)

  //caso não achar devolve como erro 
  if (!customer){
    return response.status(400).json({ error: "Não foi encontrado CPF"})
  }

  //passo o customer para a function depois de next
  request.customer = customer

  //caso encontre devolve
  return next()
}


/*
* cpf - string
* name - string
* id - UUid
* statement = estratos
*/

//criar acont
app.post("/account", (request, response) => {
  let { cpf, name } = request.body
  let id = uuidv4()

  //valida se cpf exeite
  let cpf_existente = customers.some(
    customer => customer.cpf === cpf
  )
  //Retorna error
  if (cpf_existente) {
    return response.status(400).json({ error: "Cpf já existe." })
  }

  //popula array caso não exista
  customers.push(
    {
      cpf,
      name,
      id: uuidv4(),
      statement: []
    }
  )
  return response.status(201).send("Usuario Criado com sucesso!")
})

/*
app.get("/statement/:cpf", (request, response) => {
  //desestrutura CPF
  let { cpf } = request.params

  //pesquisa e restorna 
  let customer = customers.find(customer => customer.cpf === cpf)
  // caso nao encontre restorna error
  if (!customer) {
    return response.status(400).json({ error: "Não foi encontrado CPF" })
  }

  return response.status(200).json(customer.statement)
})
*/

//para todas as rotas
// app.use(vericicarCPF)

//para uma rota especifica
app.get("/statement", vericicarCPF, (request, response) => {
  let {customer} = request
  return response.status(200).json(customer.statement)
})

app.listen(3333)