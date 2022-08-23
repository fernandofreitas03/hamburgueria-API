const { request, response } = require('express')
const express = require('express')
const uuid = require('uuid')
const cors = require('cors')
const port = 3001



const app = express()
app.use(express.json())
app.use(cors())


const status = "Em preparação"
const Orders = []


const checkUserId = (request, response, next) =>{
    const {id} = request.params
    
    const index = Orders.findIndex( user => user.id === id )

    if(index < 0 ){
        return response.status(404).json({error: "User not foud"})
    }

    request.userIndex = index
    request.userId = id

    next()
}

const CheckMethod = (request, response, next) =>{
    const method = request.app.me

    
    next()
}


app.get('/users/',CheckMethod, (request, response)=>{
    return response.json(Orders)
})


app.post('/users/',CheckMethod, (request, response)=>{
    const {order,clientName,price} = request.body

    const costumer = {id: uuid.v4(),order,clientName,price,status}

    Orders.push(costumer)
    return response.json(costumer)
})

app.put('/users/:id',checkUserId, CheckMethod, (request,response)=>{
    const {order,clientName,price} = request.body
    const index = request.userIndex
    const id = request.userId

    const Pedidos = {id, order, clientName, price, status}

    Orders[index] = Pedidos

    return response.json(Pedidos)
})


app.delete('/users/:id',checkUserId, CheckMethod, (request, response)=>{
    const index = request.userIndex

    Orders.splice(index,1)

    return response.status(204).json()
})

app.get('/users/:id',checkUserId, CheckMethod, (request, response)=>{
    const index = request.userIndex

    return response.json(Orders[index])
})

app.patch('/users/:id',checkUserId,CheckMethod,  (request, response)=>{
    const index = request.userIndex
    Orders[index].status = "Pronto"

    return response.json(Orders[index])
})


app.listen(port, ()=>{
    console.log(` Server started on port ${port}`)
})