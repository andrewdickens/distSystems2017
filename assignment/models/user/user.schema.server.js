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
            firstName: String,
            lastName: String
        },
        {collection: "distSystemsUser"});
    return DistSystemsUserSchema;
};
