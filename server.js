const express=require("express");
const app=express();
const colors=require("colors");
const cors=require("cors");
const morgan=require("morgan");
require("dotenv").config();


app.use(cors());

app.use(express.json());
app.use(morgan("dev"));


const PORT=process.env.PORT ||8080 ;

app.get("/",(req,res)=>{
    res.send("Hello");
})

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`.bgGreen.white)
})