import mongoose from "mongoose";

export default function connectMongoose() {
    return mongoose.connect('mongodb://localhost/exercisenode')
    .then(mongoose => mongoose.connection);
}