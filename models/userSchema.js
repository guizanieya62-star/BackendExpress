const mongoose = require('mongoose');
const userSchema = new mongoose.Schema ({
    username : {type : String , required : true },
    password : {type : String , required : true , minlenghth : 6 , match : [ /^(?=.*\d)(?=.*[a-z]).{6,}$/, 'Password must contain at least one uppercase letter, one lowercase letter, and one digit.']},
    email : {type : String , required : true , unique : true , lowercase : true , match : [ /@/ , 'Please fill a valid email address'] },
    role : {type : String , enum : ['admin' , 'client'] , default : 'user' },
    JoinDate : Date,
    image_User : {type : String , default : 'client.png' },
   
    age : Number,

});
const User = mongoose.model('User', userSchema);
module.exports = User;