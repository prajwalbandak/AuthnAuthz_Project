const Joi = require('@hapi/joi')


const authSchema = Joi.object({
    email : Joi.string().email().lowercase().required(),
    password: Joi.string().min(4).required(),
})



module.exports= {
    authSchema
}