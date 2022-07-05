const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config({path:'./config.env'});
 const app = require('./app');

const DB=process.env.DATABASE;

const port=process.env.port || 5000;

mongoose.connect(DB)
.then(()=>{console.log("databse connected")})
.catch((err)=>{console.log(err)})
console.log(process.env.NODE_ENV)
app.listen(port,()=>{console.log(`app is running at the port ${port}`)});
