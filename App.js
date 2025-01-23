import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './routes/myRouter.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';

dotenv.config()
const app = express()
const PORT = process.env.PORT || 7000

// const router = require('./routes/myRouter')
// app.use(router)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret:"mysession", resave:false, saveUninitialized:false}));
app.use(router);
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// const http = require('http')
// const fs = require('fs')
// const url = require('url')

// const indexPage = fs.readFileSync(`${__dirname}/public/index.html`, 'utf-8')
// const productPage1 = fs.readFileSync(`${__dirname}/public/product1.html`, 'utf-8')
// const productPage2 = fs.readFileSync(`${__dirname}/public/product2.html`, 'utf-8')
// const productPage3 = fs.readFileSync(`${__dirname}/public/product3.html`, 'utf-8')

// http.createServer((req, res) => {
//     const {pathname, query} = url.parse(req.url, true)
//     //เก็บ url เส้นทางส่ง req2server
//     if (pathname === '/' || pathname === '/home') {
//         res.end(indexPage)
//     }else if (pathname === "/product") {
//         if (query.id === '1') {
//             res.end(productPage1)
//         }else if (query.id === '2') {
//             res.end(productPage2)
//         }else if (query.id === '3') {
//             res.end(productPage3)
//         }else {
//             res.writeHead(404)
//             res.end('<h1>Product not found</h1>')
//         }
//     }else{
//         res.writeHead(404, {'Content-Type': 'text/html'})
//         res.end("Not Found")
//     }
// }).listen(3000,`localhost`,()=>{
//     console.log('Server is running on port 3000')
// })