//jshint esversion:6
const express=require("express");
const ejs=require("ejs");
const bodyParser=require("body-parser");
const mongoose=require("mongoose")
const encrypt=require("mongoose-encryption")
require('dotenv').config()

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const app=express();

app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

const Userschema=new mongoose.Schema({
    email:String,
    password:String
})

secret=process.env.SECRET

Userschema.plugin(encrypt,{secret:secret,encryptedFields:['password']});



const User=new mongoose.model("User",Userschema);

app.get('/',(req,res)=>{
    res.render("home");
})

app.get('/login',(req,res)=>{
    res.render("login");
})

app.get('/register',(req,res)=>{
    res.render("register");
})


app.post('/register',(req,res)=>{
    const newUser=new User({
        email:req.body.username,
        password:req.body.password
    })
    newUser.save().then(()=>{
        res.render("secrets");
    }).catch((e)=>{
        res.status(500).send(e);
    })

})

app.post('/login',(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    User.findOne({email:username}).then((founditem)=>{
        if(founditem){
            if(founditem.password===password){
                res.render("secrets");
            }
        }
        else{
            res.send("your accound not found");
        }
    }).catch((err)=>{
        res.status(500).send(err);
    })
})

app.listen(3000,()=>{
    console.log("app is listening on port 3000")
})
