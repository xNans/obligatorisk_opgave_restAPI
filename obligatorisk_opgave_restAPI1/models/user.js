const mongoose = require('mongoose')

const Schema = mongoose.Schema;

let userSchema = new Schema(
{
    userName: {
        type: String, 
        required: true, 
        min: 8,
        max: 50
    },
    email: {
        type: String, 
        required: true, 
        min: 10,
        max: 50
    },
    password: {
        type: String, 
        required: true, 
        min: 6,
        max: 50
    },
    creationDate: {
        type: Date, 
        default: Date.now}
});

module.exports = mongoose.model("user", userSchema)