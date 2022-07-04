import db from "../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
class controller {
  static insert = async (req, res) => {
    try {
      const checking_email = await db.schema.findOne({where:{emailAddress:req.body.emailAddress},raw:true});
      if(checking_email) return res.status(500).json({
        sucess:false,
        message:'email are already exist',
        status:500
        
      })
      const salt = await bcrypt.genSalt(15);
      const hashPassword = await bcrypt.hash(req.body.password, salt);
      const Register={
        UserName: req.body.UserName,
        emailAddress: req.body.emailAddress,
        password: hashPassword,
        refreshToken:""
        }
        console.log(Register)
        await db.schema.create(Register)
        res.status(200).json({
        sucess:true,
        message:'user are register'
      })
    } catch (err) {
      res.status(500).json({
        sucess:false,
        message:'user are not register'
      })
    }
  };
  static login = async (req, res) => {
    try {
      const userValidation = await db.schema.findOne({where:{emailAddress:req.body.emailAddress},raw:true});
      if (!userValidation) return res.status(500).json({sucess:false,message:'email is not valid'})
      const passValidation = await bcrypt.compare(
        req.body.password,
        userValidation.password
      );
      if (!passValidation) return res.status(500).json({sucess:false,message:'password is not valid'})
      const accessToken = await jwt.sign(
        { password: userValidation.password },
        process.env.accessToken,
        {
          expiresIn: "1m",
        }
      );
      const refreshToken = await jwt.sign(
        { password: userValidation.password },
        process.env.refreshToken,
        {
          expiresIn: "2d",
        }
      );
       await db.schema.update({refreshToken:refreshToken},{
        where:{
          emailAddress:userValidation.emailAddress
        }
      });


    res.header('accessToken',accessToken).header('refreshToken',refreshToken).status(200).json({sucess:true,message:'user loged in',accesstoken:accessToken,refreshToken:refreshToken})
   } 
   catch (error) {
    console.log(error);
     res.status(500).json({
       sucess:false,
       message:'token is not generated'
     })
       }
  }
  
}
export default controller;
