const createError = require('http-errors');
const User = require('../Models/User.model')
const { authSchema } = require('../helpers/validation_schema')

const { signAccessToken , signRefreshToken, verifyRefreshToken } = require('../helpers/jwt_helper')



module.exports = {
    register :  async(req,res,next) => {
        console.log(req.body);
        try {
           
    
            const result = await authSchema.validateAsync(req.body);
            const doesUserExit= await User.findOne({email:result.email})
            if(doesUserExit) throw createError.Conflict(`${result.email} is already registered.`)
    
            //const user = new User({email,password});
            const user = new User(result);
            const savedUser= await user.save();
    
            const accessToken = await signAccessToken(savedUser.id);
            const refreshToken  = await signRefreshToken(savedUser.id);
            res.send({accessToken , refreshToken })
    
    
        } catch (error) {
            if(error.isJoi === true)  error.status = 400
            
            next(error)
        }
    },
    login : async(req,res,next) => {
        try {
         const result = await authSchema.validateAsync(req.body)
         const user= await User.findOne({email:result.email})
     
         if(!user) throw createError.NotFound("User not regiseterd")
     
         const isMatch = await user.isValidPassword(result.password);
     
         if(!isMatch) throw createError.Unauthorized("Invalid password");
     
         const accessToken = await signAccessToken(user.id)
         const refreshToken  = await signRefreshToken(user.id);
     
         res.send({accessToken , refreshToken })
        } catch (error) {
         if(error.isJoi === true) 
         return next(createError.BadRequest("Invalid Username and password"))
         next(error)
        }
     },
     refreshToken : async(req,res,next) => {
        try {
           const { refreshToken } = req.body
           if(!refreshToken) throw createError.BadRequest();
    
          const userId =  await verifyRefreshToken(refreshToken)
    
          const accessToken = await signAccessToken(userId)
          const refToken  = await signRefreshToken(userId);
    
          res.send({accessToken:accessToken,refreshToken : refToken})
    
        } catch (error) {
            
        }
    }
}
