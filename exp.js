const express = require('express');
const app = express();

const middleware = (req,res,next)=>{
    console.log("I am MiddleWare");
    next();
}


//middleware();
app.get('/', (req, res) => {
    res.send("Hello World!");
});

app.get('/contact',middleware,(req, res) => {
    res.send("This is the contact page");
});

const port = 3000;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
