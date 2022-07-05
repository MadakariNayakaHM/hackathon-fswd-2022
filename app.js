//  npm install -g win-node-env
const express=require('express');
const app=express();
const helmet=require('helmet');
const path=require('path');
const xss=require('xss-clean');
const mongoSanitize=require('express-mongo-sanitize');
const rateLimit=require('express-rate-limit');
const { Server } = require('http');
const limits=rateLimit
({
    max:10,
    windowMs:60*60*1000,
    message:"too many request from this ip try to login  after 1 hour"
});
const cookieParser=require('cookie-parser')
if(process.env.NODE_ENV==='production') console.log("---------------PRODUCTION MODE----------")
if(process.env.NODE_ENV==='development') console.log("---------------DEVELOPMENT MODE----------")
app.use(express.json());
app.use(cookieParser());
app.use(cookieParser());
app.use(helmet());
app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'", 'data:', 'blob:'],
   
        fontSrc: ["'self'", 'https:', 'data:'],
  
        scriptSrc: ["'self'", 'unsafe-inline'],
   
        scriptSrc: ["'self'", 'https://*.cloudflare.com'],
   
        scriptSrcElem: ["'self'",'https:', 'https://*.cloudflare.com'],
   
        styleSrc: ["'self'", 'https:', 'unsafe-inline'],
   
        connectSrc: ["'self'", 'data', 'https://*.cloudflare.com']
      },
    })
  );
app.use(xss());
app.use(mongoSanitize());
app.use('/api',limits)


app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'));


app.use(function(req, res, next) { 
    res.setHeader( 'Content-Security-Policy', "script-src 'self' https://cdnjs.cloudflare.com" ); 
    next(); 
  })

   

const viewsRoute=require('./routers/viewsRoutes');
app.use('/',viewsRoute);

const usreRoute=require('./routers/userRoute');
app.use('/api/tyl-hackathon/user',usreRoute);
const projectRoute=require('./routers/projectRoute');
app.use('/api/tyl-hackathon',projectRoute);
const notRoute=require('./routers/notificationRoute');
app.use('/api/tyl-hackathon',notRoute);

 

module.exports =app;