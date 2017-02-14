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
        viewUsers: viewUsers,
        findUsername: findUsername

    };
    return api;

    function viewUsers(input){
        if(input.fname==undefined && input.lname!=undefined){
            return UserModel
                .find({lname:{"$regex":input.lname, "$options":"i"}});
        }else if(input.fname!=undefined && input.lname==undefined){
            return UserModel
                .find({fname:{"$regex":input.fname, "$options":"i"}});
        } else return UserModel
            .find({$and:[{fname:{"$regex":input.fname, "$options":"i"}},{lname:{"$regex":input.lname, "$options":"i"}}]});
    }

    function isAdmin(user){
        return UserModel.findOne({username:user.username});
    }
    
    function updateInfo(user, updatefield, updateValue){
      

	var key = updatefield;
	var updatePackage = {};
	updatePackage[key] = updateValue;
 
       // var updatePackage = {[updatefield]:updateValue};
       // var updatePackage = "test"

        if (updateValue == undefined){
            return UserModel.update({username:user.username});
        }else return UserModel.update({username: user.username}, updatePackage);
    }

    function allFields(user){
        return !((user.fname == "" || user.fname == undefined) ||
        (user.lname == "" || user.lname == undefined) ||
        (user.address == "" || user.address == undefined) ||
        (user.city == "" || user.city == undefined) ||
        (user.state == "" || user.state == undefined) ||
        (user.email == "" || user.email == undefined) ||
        (user.username == "" || user.username == undefined) ||
        (user.password == "" || user.password == undefined));
    }
    
    function findUsername(username){
        return UserModel.findOne({username: username});
    }

    function findUser(user){
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
        return UserModel.findOne({username: payload.username, password: payload.password});
    }

    function createUser(user) {
        return UserModel.create(user);
    }

    function findUserById(userId) {
        return UserModel.findById(userId);
    }
};
