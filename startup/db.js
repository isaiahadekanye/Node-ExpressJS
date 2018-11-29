const mongoose = require('mongoose');

module.exports = function () {
    mongoose.Promise = global.Promise;
    mongoose.connect(dataBaseLink, {
        useNewUrlParser: true
    });
    mongoose.set('useFindAndModify', false);
}