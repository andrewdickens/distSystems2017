/**
 * Created by andrewdickens on 11/19/16.
 */

module.exports = function () {
    console.log("in user.schema.server");

    var mongoose = require("mongoose");
   
    var DistSystemsUserSchema = mongoose.Schema(
        {
            username: String,
            password: String,
            fname: String,
            lname: String,
            address: String,
            city: String,
            state: String,
            zip: {},
            email: String
        },
        {collection: "distSystemsUser"});
    return DistSystemsUserSchema;
};
