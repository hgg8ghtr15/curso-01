let express = require('express')

let app = express()

app.use(express.json())

//Busca
app.get("/",(request, response) => {
    // return response.send("Bem vindo")
    return response.json({message:"Bem vindo ao react"})
})

//Busca
app.get("/cursos",(request, response) => {
    let query = request.query
    console.log(query)
    return response.json(["Curso 1", "Curso 2", "Curso 3"])
})

// post = inserir
app.post("/cursos",(request, response) => {
    let body = request.body
    console.log(body)
    return response.json(["Curso 1", "Curso 2", "Curso 3", "Curso 4"])
})

// put = alterar
app.put("/cursos/:id",(request, response) => {
    //Desestruturação
    let {id} = request.params
    console.log(id)
    return response.json(["Curso 6", "Curso 2", "Curso 3", "Curso 4"])
})

// patch = alterar especifico
app.patch("/cursos/:id",(request, response) => {
    return response.json(["Curso 7", "Curso 2", "Curso 3", "Curso 4"])
})

// delete = delata informações
app.delete("/cursos/:id",(request, response) => {
    return response.json(["Curso 7", "Curso 2", "Curso 4"])
})


app.listen(3333)