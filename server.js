const express = require('express');
const mongoose = require('mongoose');
const path = require('path');  // Import path module

require('dotenv').config();
const app = express();
const port = 3002;

app.use(express.json());
const mongoURI=process.env.MONGO_URI;
mongoose.connect(mongoURI)
.then(()=> console.log('connected to mongodb'))
.catch((err)=> console.log('could not connect to mongodb',err));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String
});

const User = mongoose.model('User',userSchema);

app.get('/users', (req, res) => {
    User.find({})
    .then(users => res.json(users))  // Changed 'user' to 'users'
    .catch(err=> res.status(500).json({
        message:err.message
    }));
});

app.post('/users',(req,res)=>{
    const  user = new User({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password
    });
    
    user.save()
    .then(data =>{
       res.status(201).json(data);
    })
    .catch(error =>{
         res.status(400).send(error);
    });
})

app.put("/users/:id",(req,res)=>{
    const userId=req.params.id;
    const updateData ={
        name:req.body.name,     
        email:req.body.email,
        password:req.body.password
    };
    User.findByIdAndUpdate(userId,updateData ,{new:true} )
    .then(updatedUser =>{
        if(!updatedUser){
            return res.status(404).json({message:"No user found with the given id"});
        }else{
           res.json(updatedUser);
        }
    }).catch(error =>{
        res.status(500).json({message: error.message});
    });
})

app.delete('/users/:id',(req,res)=>{
    const userId= req.params.id;

    User.findByIdAndDelete(userId)
    .then(deletedUser=>{
        if( !deletedUser ){
            return res.status(404).json({ message:'No user found with this Id'})
        } else {
            res.json(deletedUser);
        }
    }).catch(error=>{
        res.status(500).json({message: error.message});
    })

})

// Serve the public.html file for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
