import mongoose, { Schema } from 'mongoose';

let DishSchema = new Schema({
    uniqueName: String,
    restourant: String,
    name: String,
    price: String,
    ingredients: String,
    
    profilePicture: Buffer,
    profilePictureUrl: String,
});

const DishModel = mongoose.model('Dish', DishSchema);

export default DishModel;