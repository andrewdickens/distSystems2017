/**
 * Created by andrewdickens on 11/19/16.
 */

module.exports = function () {
    console.log("in user.schema.server");

    var mongoose = require("mongoose");

    var DistSystemsProductSchema = mongoose.Schema(
        {
            asin: {},
            ProductName: String,
            ProductDescription: String,
            group: String
        },
        {collection: "distSystemsProduct"});
    return DistSystemsProductSchema;
};
