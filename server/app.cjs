const express=require("express");
const mongoose=require("mongoose")
const cors=require("cors")
const app=express()
app.use(express.json())
app.use(cors())
const Usermodel=require('./User.cjs')

mongoose.connect("mongodb+srv://maheemshahreear2:GfWHPcKzHH6X3bHH@cluster0.b1zrje5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

app.post("/",(req,res)=> {
  const {email,password}=req.body;
  Usermodel.findOne({email:email})
  .then(user=>{
    if(user) {
      if(user.password===password) {
         res.json("success") 


      }
       else {

       res.json("the info is incorrect")


       }



    } 



  })



})

app.post('/',(req,res)=> {
   Usermodel.create(req.body)
   .then(users=>res.json(users))
   .catch(err=>res.json(err))


})
app.listen(3001,()=>{
   console.log("server is running");





} )