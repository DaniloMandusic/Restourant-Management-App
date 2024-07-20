import mongoose, { Schema } from 'mongoose';

let UserSchema = new Schema({
    username: String,
    password: String,
    securityQuestion: String,
    securityAnswer: String,
    name: String,
    surname: String,
    gender: String,
    address: String,
    phoneNumber: String,
    email: String,
    profilePicture: Buffer,
    profilePictureUrl: String,
    profileType: String,
    profileStatus: String,

    //cv: Buffer,
    //cvUrl: String,
    cardNumber: String,

    restourant: String
});

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;