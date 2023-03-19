const express = require('express')
const morgan = require('morgan')
const createError = require('http-errors')
require('dotenv').config()
const AuthRoute = require('./Routes/Auth.route.js')
require('./helpers/init.mongodb')
const { verifyAccessToken } = require('./helpers/jwt_helper')

const app = express()
app.use(morgan('dev'))
app.use(express.json()) //Printing the logs in the console terminal of req.body
app.use(express.urlencoded({extended:true}))

const PORT  = process.env.PORT || 1000

app.get('/', verifyAccessToken , async(req,res,next)=>{
    console.log(req.headers['authorization'])
    res.send("hey")
})

app.use('/auth', AuthRoute)


app.use(async (req,res,next) =>{
    // const error = new Error("Not found");
    // error.status=404;
    // next(error);
    next(createError.NotFound("this route does not exit"));
})

//next(error);
// whenever you call the above the 'next' method it will call the beloq method.

//Error Handling: contains 4 parameters.
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