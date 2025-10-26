const mongoose = require('mongoose');


module.exports.connectToMongoDB = async () => {
    mongoose.set('strictQuery', false);
    (await mongoose.connect(process.env.url_mongodb)).isObjectIdOrHexString(() => {
        console.log('Connected to MongoDB');
    }).catch((err) => {
        console.error('Error connecting to MongoDB', err);
    });
};
