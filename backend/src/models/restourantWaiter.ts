import mongoose, { Schema } from 'mongoose';

let RestourantWaiterSchema = new Schema({
    waiterUsername: String,
    waiterName: String,
    waiterSurname: String,
    restourant: String,
    restourantAddress: String,
    restourantType: String,
});

const RestourantWaiterModel = mongoose.model('RestourantWaiter', RestourantWaiterSchema);

export default RestourantWaiterModel;