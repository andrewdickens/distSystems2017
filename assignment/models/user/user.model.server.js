/**
 * Created by andrewdickens on 11/19/16.
 */
module.exports = function () {
    console.log("in user.model.server");

    var mongoose = require("mongoose");
    var DistSystemsUserSchema = require("./user.schema.server")();
    var UserModel = mongoose.model("UserModel", DistSystemsUserSchema);
    var model = {};

    var api = {
        createUser:createUser,
        findUserById: findUserById,
        findUsersByCredentials: findUsersByCredentials,
        setModel: setModel,
        findUserByUsername: findUserByUsername,
        getFirstName: getFirstName

    };
    return api;
    
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