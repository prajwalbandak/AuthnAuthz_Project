const express = require('express')
const morgan = require('morgan')
const createError = require('http-errors')
require('dotenv').config()
const AuthRoute = require('./Routes/Auth.route.js')
require('./helpers/init.mongodb')
const { verifyAccessToken } = require('./helpers/jwt_helper')

const app = express()
app.use(morgan('dev'))
app.use(express.json()) 
app.use(express.urlencoded({extended:true}))

const PORT  = process.env.PORT || 1000

app.get('/', verifyAccessToken , async(req,res,next)=>{
    console.log(req.headers['authorization'])
    res.send("hey")
})

app.use('/auth', AuthRoute)


app.use(async (req,res,next) =>{
   
    next(createError.NotFound("this route does not exit"));
})


app.use((err,req,res,next) =>{
    res.status(err.status || 500)
    res.send({
        error:{
            status:err.status || 500,
            message:err.message
        },
       
    })

})

app.listen(PORT, () =>{
    console.log(`Server is running the ${PORT}`)
})