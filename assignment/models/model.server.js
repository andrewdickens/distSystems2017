module.exports = function () {
    console.log("in model.server");

    var mongoose = require('mongoose');
    // mongoose.connect('mongodb://localhost/DistSystems-Spring-2017');
    mongoose.connect('mongodb://user:user@ds137149.mlab.com:37149/distsystemsspring2017');

    var userModel = require("./user/user.model.server")();

    
    var model = {
        userModel: userModel
    };

    userModel.setModel(model);

    return model;

};