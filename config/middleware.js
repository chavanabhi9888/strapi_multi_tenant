const jwt = require('jsonwebtoken');



module.exports = () => {
    return async (ctx, next) => {
        let token = ctx.headers["authorization"];
        if(token){
            token = token.split(" ")[1];
            console.log(token);
            jwt.verify(token, process.env.JWT_SECRET , (err, valid)=>{
                if(err){
                    res.send({result:"please Add VAlid token..."});
                }else{
                    next();
                }
                // id=valid.id
            })
        }else{
            res.send({result:"please Add token......"});
        }
    }
  };