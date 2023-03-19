const Joi = require('@hapi/joi')


const authSchema = Joi.object({
    email : Joi.string().email().lowercase().required(),
    password: Joi.string().min(4).required(),
})


//while exporting we are using the object. Here it is auth
//Schema but In future there are multiple schema are there.
module.exports= {
    authSchema
}