var jwt = require('jsonwebtoken');
const JsonAuthSign= "IAmASignature"

const featcUser = (req,res,next)=>
{
    const token= req.header('auth-token')
     if(!token){
         res.status(401).json({error:"Please enter a valid aut token"})
     }
    try{
    const data=jwt.verify(token,JsonAuthSign)
    req.user=data.user
    next()
}
catch(error){
    console.error(error)
      res.status(500).send("Oops! Some Intrnal Error Occured!")
}
}

module.exports=featcUser