import Jwt from "jsonwebtoken";
//import jwt_decode from 'jwt-decode'
export default async (req, res, next) => {
  try {
  
   const accessToken=req.header('accessToken')
   const refreshToken=req.header('refreshToken') 
   console.log('i am herer')
   if (!accessToken || !refreshToken) return res.status(500).json({sucess:false,message:"token are not provided in request"});
    const veriyfied = await Jwt.verify(
      accessToken,
      process.env.accessToken
    );
    if(veriyfied){
      next();}
    // } else{
    //   return res.status(500).json({sucess:false,message:"token are expired",veriyfied});

    // }

    
  } 
  catch (err) {
    const refreshToken=req.header('refreshToken') 
    const veriyfiedRefreshToken = await Jwt.verify(
      refreshToken,
      process.env.refreshToken
    );
    if(veriyfiedRefreshToken){
      console.log('i am in catch')
      console.log(veriyfiedRefreshToken)
      //res.send(veriyfiedRefreshToken.password)
      const accessToken = await Jwt.sign(
        {password:veriyfiedRefreshToken.password},
        process.env.accessToken,
        {
          expiresIn: "1m",
        }
      );
      const refreshToken = await Jwt.sign(
        {password:veriyfiedRefreshToken.password} ,
        process.env.refreshToken,
        {
          expiresIn: "2d",
        })
        return res.header('accessToken',accessToken).header('refreshToken',refreshToken).json({accessToken:accessToken,refreshToken:refreshToken})
      
    }else{
      res.send('iusgdfigsd')
    }

    
      //res.send(err)
    
     //return res.status(500).json({sucess:false,message:"token are expired",detail:err});
  }
};
