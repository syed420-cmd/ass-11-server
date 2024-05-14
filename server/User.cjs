const mongoose=require('mongoose')
const Register=new mongoose.Schema({
    name:String,
    email:String,
   password:String




})

const UserModel=mongoose.model("registertable",Register)
module.exports=UserModel
