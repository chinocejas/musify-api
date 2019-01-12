'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = schema({
    name: String,
    surname: String,
    email: String,
    role: String,
    password: String,
    image: String

});

module.exports = mongoose.model('User',userSchema);  