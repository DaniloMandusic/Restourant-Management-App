import mongoose, { Schema } from 'mongoose';

let RestourantSchema = new Schema({
    name: String,
    type: String,
    address: String,
    telephone: String,
    numberOfTables: String,
    freeTables: String,
    takenTables: String,
});

const RestourantModel = mongoose.model('Restourant', RestourantSchema);

export default RestourantModel;