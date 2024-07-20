import mongoose, { Schema } from 'mongoose';

let OrderSchema = new Schema({
    user: String,
    restourant: String,
    date: String,
    time: String,
    products: String,
    status: String,
    approximateTime: String,
});

const OrderModel = mongoose.model('Order', OrderSchema);

export default OrderModel;