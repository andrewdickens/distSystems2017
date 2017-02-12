module.exports = function () {
    console.log("in user.model.server");

    var mongoose = require("mongoose");
    var DistSystemsUserSchema = require("./user.schema.server")();
    // var searchable = require('mongoose-searchable');
    var UserModel = mongoose.model("UserModel", DistSystemsUserSchema);
    // DistSystemsUserSchema.plugin(searchable);
    var model = {};

    var api = {
        createUser:createUser,
        findUserById: findUserById,
        findUsersByCredentials: findUsersByCredentials,
        setModel: setModel,
        findUserByUsername: findUserByUsername,
        getFirstName: getFirstName,
        allFields: allFields,
        findUser: findUser,
        updateInfo: updateInfo,
        isAdmin: isAdmin,
        viewUsers: viewUsers

    };
    return api;

    function viewUsers(){
        return UserModel.find()
    }

    function isAdmin(user){
        return UserModel.findOne({username:user.username});
    }
    
    function updateInfo(user, updatefield, updateValue){
        
        var updatePackage = {[updatefield]:updateValue};
        
        if (updateValue == undefined){
            return null;
        }else return UserModel.update({username: user.username}, updatePackage);
    }

    function allFields(user){
        console.log("in all fields");
        
        return !((user.fname == "" || user.fname == undefined) ||
        (user.lname == "" || user.lname == undefined) ||
        (user.address == "" || user.address == undefined) ||
        (user.city == "" || user.city == undefined) ||
        (user.state == "" || user.state == undefined) ||
        (user.email == "" || user.email == undefined) ||
        (user.username == "" || user.username == undefined) ||
        (user.password == "" || user.password == undefined));
    }

    function findUser(user){
        console.log("in findUser");

        return UserModel.findOne({username:user.username});
    }

    function getFirstName(username){
        return UserModel.findOne({username: username});
    }
    
    function findUserByUsername(username){
        return UserModel
            .findOne({username: username});
    }

    function setModel(_model) {
        model = _model;
    }
    
    function findUsersByCredentials(payload) {
        console.log("username is " + payload.username + " and password is " + payload.password);
        return UserModel.findOne({username: payload.username, password: payload.password});
    }

    function createUser(user) {
        console.log("in createUser [feature.model.server.js]");
        console.log(user);

        return UserModel.create(user);
    }

    function findUserById(userId) {
        return UserModel.findById(userId);
    }
};