//Routing is the process of selecting a path for traffic in a network or between or across multiple networks.
import express from 'express';
import Product, {saveProduct} from '../models/products.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const router = express.Router()
//const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/products')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({
    storage: storage
})

router.get("/", async(req, res)=>{
    try {
        const products = await Product.find().exec();
        res.render('index', { products: products });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving products');
    }
})

router.get(`/add-product`,(req, res)=>{
    // if(req.cookies.login){
    //     res.render('form')
    // }else{
    //     res.render('admin')
    // }
    if(req.session.login){
        res.render('form')
    }else{
        res.render('admin')
    }
})

router.get(`/manage`, async(req, res)=>{
//     if(req.cookies.login){
//         try {
//             const products = await Product.find().exec();
//             res.render('manage', { products: products });
//         } catch (err) {
//             console.error(err);
//             res.status(500).send('Error retrieving products');
//         }
//    } else{
//          res.render('admin')
//    }
    console.log("Session id:", req.sessionID);
    console.log("Data in session:", req.session)
    if(req.session.login){
        try {
            const products = await Product.find().exec();
            res.render('manage', { products: products });
        } catch (err) {
            console.error(err);
            res.status(500).send('Error retrieving products');
        }
    } else{
        res.render('admin')
    }  
    
})

router.get('/logout', (req, res) => {
    // res.clearCookie('username');
    // res.clearCookie('password');
    // res.clearCookie('login');
    try {
        req.session.destroy();
        res.redirect('/manage');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error logging out');
    }
});


router.get('/delete/:id', async(req, res) => {
    try {
        const product = await Product.findById(req.params.id).exec();
        if (product) {
            const imagePath = path.join('public/images/products', product.image);
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Error deleting image file:', err);
                }
            });
            await Product.findByIdAndDelete(req.params.id).exec();
        }
        res.redirect('/manage');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting product');
    }
});

//Always define more specific routes before dynamic routes
router.get(`/:id`, async(req, res)=> {
    try {
        const product = await Product.findOne({_id:req.params.id}).exec();
        res.render('product', { product: product });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving product');
    }
})

router.post(`/insert`, upload.single("image"), async(req, res)=>{
    let data = {
        name: req.body.name,
        price: req.body.price,
        image: req.file.filename,
        description: req.body.description
    };
    try {
        await saveProduct(data);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error saving product');
    }
})

router.post('/edit', async(req, res) => {
    try{
        const product = await Product.findOne({_id:req.body.id}).exec();
        res.render('edit', { product: product });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving product');
    }
})

router.post('/update', upload.single("image"), async(req, res) => {
    try {
        const product = await Product.findById(req.body.id).exec();
        if (product) {
            // Delete the old image file if a new image is uploaded
            if (req.file) {
                const oldImagePath = path.join('public/images/products', product.image);
                fs.unlink(oldImagePath, (err) => {
                    if (err) {
                        console.error('Error deleting old image file:', err);
                    }
                });
                product.image = req.file.filename;
            }
            product.name = req.body.name;
            product.price = req.body.price;
            product.description = req.body.description;
            await product.save();
        }
        res.redirect('/manage');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating product');
    }
});

router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const timeOut = 1000 * 30; //30 sec
    
    if (username === 'admin' && password === '123') {
    // Cookies are stored in the client's browser. They are not secure for storing sensitive information.
    //     res.cookie('username', username, {maxAge: timeOut});
    //     res.cookie('password', password, {maxAge: timeOut});
    //     res.cookie('login', true, {maxAge: timeOut}); //true->login
    // Session data is stored on the server. It is more secure than cookies.
        req.session.username = username;
        req.session.password = password;
        req.session.login = true;
        req.session.cookie.maxAge = timeOut;
        res.redirect('/manage');
    } else {
        res.render('404');
    }
});
//Static file doesn't need to be processed by the server. It can be directly accessed by the client.
// router.get("/",(req, res)=>{
    //     res.status(200)
    //     res.type('text/html')
    //     res.sendFile(path.join(__dirname, '../template/index.html'))
    // })
    
    // router.get("/product/:id",(req, res)=>{
        //     const productID = req.params.id
        //     if (productID < 1 || productID > 3) {
            //         res.redirect('/')
            //     } else {
                //         res.status(200)
                //         res.type('text/html')
//         res.sendFile(path.join(__dirname, `../template/product${productID}.html`))
//     }
// })

export default router;