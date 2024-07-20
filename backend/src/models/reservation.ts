import mongoose, { Schema } from 'mongoose';

let ReservationSchema = new Schema({
    user: String,
    restourant: String,
    date: String,
    time: String,
    numOfPersons: String,
    additionalInfo: String,
    restourantAddress: String,
    status: String,
    declineComment: String,
    waiter: String,
    table: String
});

const ReservationModel = mongoose.model('Reservation', ReservationSchema);

export default ReservationModel;