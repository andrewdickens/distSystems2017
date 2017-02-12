/**
 * Created by andrewdickens on 11/19/16.
 */

module.exports = function () {
    console.log("in user.schema.server");

    var mongoose = require("mongoose");
    var searchable = require('mongoose-searchable');

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
            email: String,
            admin: Boolean
        },
        {collection: "distSystemsUser"});

    DistSystemsUserSchema.plugin(searchable);

    return DistSystemsUserSchema;
};
