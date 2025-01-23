//use mongoose
import mongoose from 'mongoose';
import dotenv from 'dotenv';

//connect to database
dotenv.config();
const MONGOURL = process.env.MONGO_URL
mongoose.connect(MONGOURL).then(()=>[
    console.log('Connected to database')
]).catch(error => console.log(error));

//create schema
let productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image: String,
    description: String
})

//create model
let Product = mongoose.model('products', productSchema)

//export model
export default Product

//create save function
export const saveProduct = (data) => {
    let product = new Product(data);
    return product.save();
};