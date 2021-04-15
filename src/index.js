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
  let { cpf } = request.headers
  // let {cpf} = request.body

  //procura o cpf
  let customer = customers.find((customer) => customer.cpf === cpf)

  //caso não achar devolve como erro 
  if (!customer) {
    return response.status(400).json({ error: "Não foi encontrado CPF" })
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
      statement: [],
      montante: 0
    }
  )
  return response.status(201).send("Usuario Criado com sucesso!")
})

{
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
}

app.get("/statement", vericicarCPF, (request, response) => {
  let { customer } = request
  return response.status(200).json(customer.statement)
})

app.post("/deposito", vericicarCPF, (request, response) => {
  let { descricao, deposito } = request.body
  let { customer } = request

  let estratooperacao = {
    descricao,
    deposito,
    data: new Date(),
    tipo: "Credito"
  }

  customer.montante = customer.montante + parseFloat(deposito)

  customer.statement.push(estratooperacao)
  return response.status(200).json(customer)
})

app.post("/saque", vericicarCPF, (request, response) => {
  let {customer} = request

  let {saque, descricao} = request.body

  if(saque > customer.montante){
    // console.log("Saque maior")
    return response.status(200).send("Valor do saque maior que o Montante.")
  }else{
    customer.montante = customer.montante - saque
    
    let estratooperacao = {
      descricao,
      saque,
      data: new Date(),
      tipo: "Saque"
    }
    customer.statement.push(estratooperacao)
    // console.log("montante maior")
  }
  
  return response.status(200).send("Concluido")
})

app.get("/statement/data", vericicarCPF, (request, response) => {
  let { customer } = request
  let { data } = request.query
  // aaaa-mm-dd
  let dataFormatada = new Date(data + " 00:00")
  // console.log(dataFormatada)
  // console.log(customer.statement[0].data)

  let statement = customer.statement.filter(
    (statement) =>
      (statement.data.getFullYear() + statement.data.getDate() + statement.data.getDay()) ===
      (dataFormatada.getFullYear() + dataFormatada.getDate() + dataFormatada.getDay())
  )

  // console.log(statement)

  return response.status(200).json(statement)
})

app.get("/account", vericicarCPF, (request, response) => {
  let { customer } = request
  console.log(customer)
  return response.status(200).json(customer)
})

app.put("/account", vericicarCPF, (request, response) => {
  let { customer } = request
  let { name } = request.body

  customer.name = name
  return response.status(200).send("Nome atualizado com sucesso.")
})

app.delete("/account", vericicarCPF, (request, response) => {
  let { customer } = request

  //remove o item da lista
  customers.splice(customer, 1)
  return response.status(200).json(customers)
})

app.get("/balanco", vericicarCPF, (request, response) => {
  let { customer } = request
  let balanco = customer.montante
  console.log(balanco)
  return response.status(200).json(balanco)
})

app.listen(3333)