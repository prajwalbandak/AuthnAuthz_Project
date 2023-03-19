const mongoose = require('mongoose')

mongoose.connect (process.env.MONGODB_URI,{
    dbName:process.env.DB_NAME,
    // useNewUrlparser: true,
    // userUnifiedTopology:true,
    // userFindAndModify:false,
    // userCreateIndex:true
}).then(() =>{
    console.log("mongodb created")
}).catch((err)=>
    console.log("the error" + err.message))


mongoose.connection.on('connected', ()=>{
    console.log("mongoose connected to DB")
})

mongoose.connection.on('error',(err) =>{
    console.log(err.message)
})

mongoose.connection.on('disconnected', ()=>{
    console.log("mongoose  DB is disconnected")
})



process.on('SIGINT',async()=>{
    await mongoose.connection.close()
    process.exit(0)
})
